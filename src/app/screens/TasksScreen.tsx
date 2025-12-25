import { useState, useEffect } from "react";
import { ChevronLeft, Search, X } from "lucide-react";
import { TaskCard } from "../components/trineo/TaskCard";
import { tasksAPI } from "../../services/api";

interface TasksScreenProps {
  onTaskClick: (taskId: string) => void;
  onBack: () => void;
}

export function TasksScreen({ onTaskClick, onBack }: TasksScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Generate dates for current week
  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push({
        day: date.getDate(),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date,
      });
    }
    return dates;
  };

  const dates = getWeekDates();

  const filters = [
    { id: "all", label: "All" },
    { id: "todo", label: "To-Do" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  useEffect(() => {
    loadTasks();
  }, [selectedFilter]);

  // Refresh when task is added (debounced)
  useEffect(() => {
    let refreshTimeout: number;
    const handleTaskAdded = () => {
      // Debounce to prevent multiple rapid refreshes
      clearTimeout(refreshTimeout);
      refreshTimeout = window.setTimeout(() => {
        loadTasks();
      }, 300);
    };
    window.addEventListener('taskAdded', handleTaskAdded);
    return () => {
      window.removeEventListener('taskAdded', handleTaskAdded);
      clearTimeout(refreshTimeout);
    };
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks based on filter
      let allTasks;
      if (selectedFilter === "all") {
        allTasks = await tasksAPI.getAll();
      } else {
        allTasks = await tasksAPI.getAll(selectedFilter);
      }

      // Format tasks for display
      const formattedTasks = allTasks.map((task: any) => ({
        id: task._id,
        title: task.title,
        project: task.projectId?.name || 'No Project',
        time: task.estimatedTime 
          ? `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60}m` 
          : '0h 0m',
        progress: task.progress || 0,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
      }));

      setAllTasks(formattedTasks);
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks by search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setTasks(allTasks);
    } else {
      const filtered = allTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTasks(filtered);
    }
  }, [searchQuery, allTasks]);

  // Calculate task counts for badges
  const getTaskCount = (status: string) => {
    return allTasks.filter((task) => task.status === status).length;
  };

  const filteredTasks = tasks;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto" style={{ paddingBottom: '52px' }}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl px-6 pt-10 pb-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/20 dark:border-[#334155]/30">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
          >
            <ChevronLeft className="w-5 h-5 text-[#0F172A] dark:text-white" />
          </button>
          <h2 className="flex-1 text-[#0F172A] dark:text-white" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Tasks
          </h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
          >
            <Search className="w-5 h-5 text-[#0F172A] dark:text-white" />
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]"
                style={{ fontWeight: 500 }}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#64748B]/20 dark:bg-[#94A3B8]/20 flex items-center justify-center hover:bg-[#64748B]/30 dark:hover:bg-[#94A3B8]/30 transition-all"
                >
                  <X className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Date Selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date) => (
            <button
              key={date.day}
              onClick={() => setSelectedDate(date.day)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                selectedDate === date.day
                  ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_8px_25px_rgba(30,64,175,0.35)]"
                  : "bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl text-[#64748B] dark:text-[#94A3B8] hover:bg-white/80 dark:hover:bg-[#1E293B]/80 border border-white/30 dark:border-[#334155]/50 shadow-sm"
              }`}
            >
              <span className="text-xs" style={{ fontWeight: 600 }}>
                {date.label}
              </span>
              <span style={{ fontWeight: 800, fontSize: '18px' }}>{date.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-6 py-5 bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-xl border-b border-gray-100 dark:border-[#334155]">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => {
            const count = getTaskCount(filter.id === "all" ? "" : filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl transition-all duration-300 relative ${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_6px_25px_rgba(30,64,175,0.3)]"
                    : "bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl text-[#64748B] dark:text-[#94A3B8] hover:bg-white/80 dark:hover:bg-[#1E293B]/80 border border-white/30 dark:border-[#334155]/50 shadow-sm"
                }`}
                style={{ fontWeight: 700 }}
              >
                {filter.label}
                {count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedFilter === filter.id
                      ? "bg-white/30 text-white"
                      : "bg-[#64748B]/20 dark:bg-[#94A3B8]/20 text-[#64748B] dark:text-[#94A3B8]"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks List */}
      <div className="px-6 py-8 space-y-5">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#94A3B8]" style={{ fontWeight: 500 }}>Loading tasks...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClick={() => onTaskClick(task.id)}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8]" style={{ fontWeight: 500 }}>No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}