import { useState, useEffect, useRef } from "react";
import { Bell, ChevronRight, CheckCircle2, Clock, ListTodo, AlertCircle, Plus, Calendar, Target, RefreshCw, X } from "lucide-react";
import { CircularProgress } from "../components/trineo/CircularProgress";
import { TaskCard } from "../components/trineo/TaskCard";
import { ProjectCard } from "../components/trineo/ProjectCard";
import { tasksAPI, projectsAPI, tasksAPI as statsAPI, authAPI } from "../../services/api";
import { NotificationService } from "../../services/notifications";

interface HomeScreenProps {
  onTaskClick: (taskId: string) => void;
  onViewTasks: () => void;
  onAddTask?: () => void;
}

export function HomeScreen({ onTaskClick, onViewTasks, onAddTask }: HomeScreenProps) {
  const [inProgressTasks, setInProgressTasks] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    totalProgress: 0, 
    total: 0, 
    completed: 0, 
    inProgress: 0, 
    todo: 0 
  });
  const [user, setUser] = useState({ name: "User" });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when task is added (only if we're on home screen)
  useEffect(() => {
    let refreshTimeout: number;
    const handleTaskAdded = () => {
      // Debounce to prevent multiple rapid refreshes
      clearTimeout(refreshTimeout);
      refreshTimeout = window.setTimeout(() => {
        loadData();
      }, 300);
    };
    window.addEventListener('taskAdded', handleTaskAdded);
    return () => {
      window.removeEventListener('taskAdded', handleTaskAdded);
      clearTimeout(refreshTimeout);
    };
  }, []);

  // Periodic notification check (every 5 minutes when app is active)
  useEffect(() => {
    if (NotificationService.getPermission() !== 'granted') return;

    const checkInterval = setInterval(() => {
      // Only check if app is visible/active
      if (!document.hidden) {
        loadData(); // This will trigger notification checks
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkInterval);
  }, []);

  // Pull to refresh handler
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    const scrollTop = scrollContainerRef.current.scrollTop;
    
    // Only trigger pull-to-refresh if at top of page
    if (scrollTop === 0) {
      touchEndY.current = e.touches[0].clientY;
      const pullDistance = touchEndY.current - touchStartY.current;
      
      if (pullDistance > 50 && !refreshing) {
        setRefreshing(true);
        loadData().finally(() => {
          setTimeout(() => setRefreshing(false), 500);
        });
      }
    }
  };

  const handleQuickComplete = async (taskId: string) => {
    try {
      await tasksAPI.update(taskId, { status: 'completed', progress: 100 });
      window.dispatchEvent(new Event('taskAdded'));
      loadData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }

      // Load in-progress tasks
      const tasks = await tasksAPI.getAll('in-progress');
      const formattedTasks = tasks.slice(0, 3).map((task: any) => ({
        id: task._id,
        title: task.title,
        project: task.projectId?.name || 'No Project',
        time: task.estimatedTime ? `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60}m` : '0h 0m',
        progress: task.progress || 0,
        status: task.status,
      }));
      setInProgressTasks(formattedTasks);

      // Load projects
      const projectsData = await projectsAPI.getAll();
      setProjects(projectsData);

      // Load stats
      const statsData = await statsAPI.getStats();
      setStats({ 
        totalProgress: statsData.totalProgress || 0,
        total: statsData.total || 0,
        completed: statsData.completed || 0,
        inProgress: statsData.inProgress || 0,
        todo: statsData.todo || 0
      });

      // Load today's tasks (tasks due today or overdue)
      const allTasks = await tasksAPI.getAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTasksList = allTasks.filter((task: any) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate <= today && task.status !== 'completed';
      }).slice(0, 3).map((task: any) => ({
        id: task._id,
        title: task.title,
        project: task.projectId?.name || 'No Project',
        time: task.estimatedTime ? `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60}m` : '0h 0m',
        progress: task.progress || 0,
        status: task.status,
        dueDate: task.dueDate,
        isOverdue: new Date(task.dueDate) < today
      }));
      setTodayTasks(todayTasksList);

      // Load notifications (overdue tasks, tasks due today, etc.)
      const notificationsList = [];
      
      // Overdue tasks
      const overdueTasks = allTasks.filter((task: any) => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < today;
      });
      overdueTasks.forEach((task: any) => {
        notificationsList.push({
          id: `overdue-${task._id}`,
          type: 'overdue',
          title: task.title,
          message: `Task "${task.title}" is overdue`,
          taskId: task._id,
          timestamp: new Date(task.dueDate),
        });
      });

      // Tasks due today
      const dueTodayTasks = allTasks.filter((task: any) => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });
      dueTodayTasks.forEach((task: any) => {
        notificationsList.push({
          id: `today-${task._id}`,
          type: 'due-today',
          title: task.title,
          message: `Task "${task.title}" is due today`,
          taskId: task._id,
          timestamp: new Date(),
        });
      });

      // Sort by timestamp (most recent first)
      notificationsList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setNotifications(notificationsList);

      // Send push notifications for overdue and due today tasks
      if (NotificationService.getPermission() === 'granted') {
        // Notify overdue tasks (only once per task, but reset if task is updated)
        overdueTasks.forEach(async (task: any) => {
          const notificationKey = `notified-overdue-${task._id}`;
          const lastNotified = localStorage.getItem(notificationKey);
          const taskUpdated = new Date(task.updatedAt || task.createdAt).getTime();
          const shouldNotify = !lastNotified || parseInt(lastNotified) < taskUpdated;
          
          if (shouldNotify) {
            await NotificationService.notifyOverdueTask(task.title, task._id);
            localStorage.setItem(notificationKey, Date.now().toString());
          }
        });

        // Notify tasks due today (once per day)
        dueTodayTasks.forEach(async (task: any) => {
          const notificationKey = `notified-today-${task._id}-${today.toDateString()}`;
          if (!localStorage.getItem(notificationKey)) {
            await NotificationService.notifyTaskDueToday(task.title, task._id);
            localStorage.setItem(notificationKey, 'true');
          }
        });

        // Schedule daily reminder (once per day at 9 AM)
        const now = new Date();
        if (now.getHours() >= 9 && now.getHours() < 10) {
          NotificationService.scheduleDailyReminder();
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  const getShortDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'short' });
    const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
    return { day, month, weekday };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto" 
      style={{ paddingBottom: '52px' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl px-6 pt-10 pb-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/20 dark:border-[#334155]/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mb-2" style={{ fontWeight: 500 }}>{getGreeting()},</p>
            <h2 className="text-[#0F172A] dark:text-white" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {user.name || 'User'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefreshing(true);
                loadData().finally(() => {
                  setTimeout(() => setRefreshing(false), 500);
                });
              }}
              disabled={refreshing}
              className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:bg-white/80 dark:hover:bg-[#1E293B]/80 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-[#64748B] dark:text-[#94A3B8] ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-14 h-14 rounded-2xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative shadow-sm hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
            >
              <Bell className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
              {notifications.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.5)]"></span>
              )}
            </button>
          </div>
        </div>

        {/* Date Display */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#2563EB] flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
              {getShortDate().weekday}, {getShortDate().month} {getShortDate().day}
            </p>
            <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#1E40AF] to-[#2563EB] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ListTodo className="w-5 h-5 text-white/80" />
              <span className="text-white/60 text-xs" style={{ fontWeight: 500 }}>Total</span>
            </div>
            <p className="text-white text-2xl" style={{ fontWeight: 800 }}>{stats.total}</p>
            <p className="text-white/70 text-xs mt-1">Tasks</p>
          </div>
          <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-white/80" />
              <span className="text-white/60 text-xs" style={{ fontWeight: 500 }}>Done</span>
            </div>
            <p className="text-white text-2xl" style={{ fontWeight: 800 }}>{stats.completed}</p>
            <p className="text-white/70 text-xs mt-1">Completed</p>
          </div>
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-white/80" />
              <span className="text-white/60 text-xs" style={{ fontWeight: 500 }}>Active</span>
            </div>
            <p className="text-white text-2xl" style={{ fontWeight: 800 }}>{stats.inProgress}</p>
            <p className="text-white/70 text-xs mt-1">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-white/80" />
              <span className="text-white/60 text-xs" style={{ fontWeight: 500 }}>Pending</span>
            </div>
            <p className="text-white text-2xl" style={{ fontWeight: 800 }}>{stats.todo}</p>
            <p className="text-white/70 text-xs mt-1">To Do</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-[28px] p-7 shadow-[0_20px_60px_rgba(30,64,175,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h3 className="text-white mb-3 leading-tight" style={{ fontSize: '22px', fontWeight: 700 }}>
                Your today's task
                <br />
                almost done
              </h3>
              <button
                onClick={onViewTasks}
                className="bg-white/25 hover:bg-white/35 text-white px-6 py-3 rounded-2xl transition-all duration-300 backdrop-blur-xl border border-white/20 mt-4 inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ fontWeight: 700 }}
              >
                View Tasks
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-shrink-0">
              <CircularProgress progress={stats.totalProgress} size={110} strokeWidth={7} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {onAddTask && (
        <div className="px-6 mb-6 mt-8">
          <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
            <h3 className="text-[#0F172A] dark:text-white mb-4" style={{ fontSize: '18px', fontWeight: 700 }}>
              Quick Actions
            </h3>
            <div className="flex gap-3">
              <button
                onClick={onAddTask}
                className="flex-1 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                style={{ fontWeight: 700 }}
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
              <button
                className="flex-1 bg-gradient-to-br from-[#F8FAFC] dark:from-[#334155] to-white dark:to-[#1E293B] border-2 border-gray-200 dark:border-[#475569] text-[#0F172A] dark:text-white py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                style={{ fontWeight: 700 }}
              >
                <Target className="w-5 h-5 text-[#1E40AF] dark:text-[#60A5FA]" />
                New Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Tasks Section */}
      {todayTasks.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
              <h3 className="text-[#0F172A] dark:text-white" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}>
                Due Today
              </h3>
            </div>
            <button
              onClick={onViewTasks}
              className="text-[#1E40AF] dark:text-[#60A5FA] text-sm flex items-center gap-1 hover:gap-2 transition-all group"
              style={{ fontWeight: 700 }}
            >
              See All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {todayTasks.map((task) => (
              <div key={task.id} className="min-w-[290px] relative group">
                {task.isOverdue && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white text-xs px-2.5 py-1 rounded-full shadow-lg z-10" style={{ fontWeight: 700 }}>
                    Overdue
                  </div>
                )}
                {task.status !== 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickComplete(task.id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border border-[#22C55E]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  </button>
                )}
                <TaskCard
                  {...task}
                  onClick={() => onTaskClick(task.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Section */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#0F172A] dark:text-white" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            In Progress
          </h3>
          <button
            onClick={onViewTasks}
            className="text-[#1E40AF] dark:text-[#60A5FA] text-sm flex items-center gap-1 hover:gap-2 transition-all group"
            style={{ fontWeight: 700 }}
          >
            See All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">Loading...</div>
        ) : inProgressTasks.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {inProgressTasks.map((task) => (
              <div key={task.id} className="min-w-[290px]">
                <TaskCard
                  {...task}
                  onClick={() => onTaskClick(task.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">No tasks in progress</div>
        )}
      </div>

      {/* Projects Section */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#0F172A] dark:text-white" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            Projects
          </h3>
          <button className="text-[#1E40AF] dark:text-[#60A5FA] text-sm flex items-center gap-1 hover:gap-2 transition-all group" style={{ fontWeight: 700 }}>
            See All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">Loading...</div>
        ) : projects.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {projects.map((project) => (
              <ProjectCard 
                key={project._id} 
                id={project._id}
                name={project.name}
                type={project.type}
                progress={project.progress}
                tasksCompleted={project.tasksCompleted}
                totalTasks={project.totalTasks}
                color={project.color}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">No projects yet          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 pointer-events-none">
          <div className="bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-2xl rounded-3xl w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 pointer-events-auto max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-[#334155]/50">
              <h3 className="text-[#0F172A] dark:text-white" style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-10 h-10 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50 hover:bg-white/70 dark:hover:bg-[#475569]/70 transition-all"
              >
                <X className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (notification.taskId) {
                          onTaskClick(notification.taskId);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                        notification.type === 'overdue'
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'overdue'
                            ? 'bg-red-100 dark:bg-red-900/40'
                            : 'bg-blue-100 dark:bg-blue-900/40'
                        }`}>
                          {notification.type === 'overdue' ? (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold mb-1 ${
                            notification.type === 'overdue'
                              ? 'text-red-900 dark:text-red-200'
                              : 'text-blue-900 dark:text-blue-200'
                          }`}>
                            {notification.type === 'overdue' ? 'Overdue Task' : 'Due Today'}
                          </p>
                          <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 600 }}>
                            {notification.title}
                          </p>
                          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20 dark:border-[#475569]/50">
                    <Bell className="w-8 h-8 text-[#64748B] dark:text-[#94A3B8]" />
                  </div>
                  <p className="text-[#64748B] dark:text-[#94A3B8]" style={{ fontWeight: 500 }}>
                    No notifications
                  </p>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
