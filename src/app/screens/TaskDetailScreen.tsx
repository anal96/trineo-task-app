import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Calendar, Clock, Tag, CheckCircle2, Loader2, XCircle, Play, Check, Trash2 } from "lucide-react";
import { tasksAPI } from "../../services/api";
import { useTheme } from "../contexts/ThemeContext";

interface TaskDetailScreenProps {
  taskId: string;
  onBack: () => void;
}

export function TaskDetailScreen({ taskId, onBack }: TaskDetailScreenProps) {
  const { theme } = useTheme();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [updating, setUpdating] = useState(false);

  const loadTask = useCallback(async () => {
    if (!taskId) {
      setError("No task ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedTask = await tasksAPI.getById(taskId);
      setTask(fetchedTask);
      setProgress(fetchedTask.progress || 0);
    } catch (err: any) {
      console.error("Error loading task details:", err);
      setError(err.message || "Failed to load task");
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleUpdateProgress = async (newProgress: number) => {
    if (!task || updating) return;
    
    setUpdating(true);
    try {
      await tasksAPI.update(taskId, { progress: newProgress });
      setTask({ ...task, progress: newProgress });
      // Trigger refresh for other screens
      window.dispatchEvent(new Event('taskAdded'));
    } catch (err: any) {
      console.error("Error updating progress:", err);
      alert("Failed to update progress: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task || updating) return;
    
    setUpdating(true);
    try {
      const updateData: any = { status: newStatus };
      
      // If marking as completed, set progress to 100
      if (newStatus === 'completed') {
        updateData.progress = 100;
        setProgress(100);
      }
      
      const updatedTask = await tasksAPI.update(taskId, updateData);
      setTask(updatedTask);
      // Trigger refresh for other screens
      window.dispatchEvent(new Event('taskAdded'));
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task || updating) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    setUpdating(true);
    try {
      await tasksAPI.delete(taskId);
      // Trigger refresh for other screens
      window.dispatchEvent(new Event('taskAdded'));
      // Navigate back to tasks list
      onBack();
    } catch (err: any) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (minutes: number | null) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-[#22C55E]/15', border: 'border-[#22C55E]/20', text: 'text-[#22C55E]', dot: 'bg-[#22C55E]' };
      case 'in-progress':
        return { bg: 'bg-[#F59E0B]/15', border: 'border-[#F59E0B]/20', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' };
      case 'todo':
        return { bg: 'bg-[#64748B]/15', border: 'border-[#64748B]/20', text: 'text-[#64748B]', dot: 'bg-[#64748B]' };
      default:
        return { bg: 'bg-[#64748B]/15', border: 'border-[#64748B]/20', text: 'text-[#64748B]', dot: 'bg-[#64748B]' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-[#EF4444]/15', border: 'border-[#EF4444]/20', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' };
      case 'medium':
        return { bg: 'bg-[#F59E0B]/15', border: 'border-[#F59E0B]/20', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' };
      case 'low':
        return { bg: 'bg-[#22C55E]/15', border: 'border-[#22C55E]/20', text: 'text-[#22C55E]', dot: 'bg-[#22C55E]' };
      default:
        return { bg: 'bg-[#64748B]/15', border: 'border-[#64748B]/20', text: 'text-[#64748B]', dot: 'bg-[#64748B]' };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#64748B] dark:text-[#94A3B8]">Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] items-center justify-center px-6">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-[#64748B] dark:text-[#94A3B8] text-center">{error || "Task not found"}</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-3 bg-[#1E40AF] text-white rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority || 'medium');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto" style={{ paddingBottom: '52px' }}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl px-6 pt-10 pb-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/20 dark:border-[#334155]/50">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-[#0F172A] dark:text-white" />
          </button>
          <h2 className="text-[#0F172A] dark:text-white" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Task Details
          </h2>
        </div>
      </div>

      {/* Task Content */}
      <div className="px-6 py-8 space-y-6">
        {/* Title & Project */}
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
          <h3 className="text-[#0F172A] dark:text-white mb-3" style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px' }}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2.5 text-[#64748B] dark:text-[#94A3B8]">
            <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
              <Tag className="w-4 h-4" />
            </div>
            <span style={{ fontWeight: 600 }}>{task.projectId?.name || 'No Project'}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
          <h4 className="text-[#0F172A] dark:text-white mb-4" style={{ fontWeight: 700, fontSize: '16px' }}>
            Description
          </h4>
          <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed" style={{ fontWeight: 500 }}>
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#2563EB] rounded-3xl p-7 shadow-[0_20px_60px_rgba(30,64,175,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-5 relative z-10">
            <h4 className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
              Progress
            </h4>
            <span className="text-white" style={{ fontSize: '24px', fontWeight: 800 }}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-4 relative z-10">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Progress Slider */}
          <div className="mb-6 relative z-10">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newProgress = parseInt(e.target.value);
                setProgress(newProgress);
              }}
              onMouseUp={(e) => {
                const newProgress = parseInt((e.target as HTMLInputElement).value);
                handleUpdateProgress(newProgress);
              }}
              onTouchEnd={(e) => {
                const newProgress = parseInt((e.target as HTMLInputElement).value);
                handleUpdateProgress(newProgress);
              }}
              className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, white 0%, white ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
              }}
              disabled={updating}
            />
            <div className="flex justify-between mt-2 text-white/70 text-xs">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          {/* Quick Progress Buttons */}
          <div className="grid grid-cols-4 gap-2 relative z-10">
            {[0, 25, 50, 100].map((value) => (
              <button
                key={value}
                onClick={() => handleUpdateProgress(value)}
                disabled={updating || progress === value}
                className="bg-white/25 hover:bg-white/35 text-white py-2.5 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 700, fontSize: '14px' }}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
          <h4 className="text-[#0F172A] dark:text-white mb-4" style={{ fontWeight: 700, fontSize: '16px' }}>
            Status
          </h4>
          <div className={`inline-flex items-center gap-3 ${statusColors.bg} px-5 py-3 rounded-2xl border ${statusColors.border} mb-4`}>
            <div className={`w-2.5 h-2.5 ${statusColors.dot} rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}></div>
            <span className={statusColors.text} style={{ fontWeight: 700 }}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          
          {/* Status Change Buttons */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={() => handleStatusChange('todo')}
              disabled={updating || task.status === 'todo'}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                task.status === 'todo'
                  ? 'bg-[#64748B] text-white shadow-lg'
                  : 'bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-white/70 dark:hover:bg-[#475569]/70 border border-white/20 dark:border-[#475569]/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              <XCircle className="w-4 h-4" />
              To Do
            </button>
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={updating || task.status === 'in-progress'}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                task.status === 'in-progress'
                  ? 'bg-[#F59E0B] text-white shadow-lg'
                  : 'bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-white/70 dark:hover:bg-[#475569]/70 border border-white/20 dark:border-[#475569]/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              <Play className="w-4 h-4" />
              Active
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={updating || task.status === 'completed'}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                task.status === 'completed'
                  ? 'bg-[#22C55E] text-white shadow-lg'
                  : 'bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-white/70 dark:hover:bg-[#475569]/70 border border-white/20 dark:border-[#475569]/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Done
            </button>
          </div>
        </div>

        {/* Dates & Time */}
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
              <div className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                <Calendar className="w-5 h-5" />
              </div>
              <span style={{ fontWeight: 600 }}>Created</span>
            </div>
            <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 700 }}>
              {formatDate(task.createdAt)}
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-[#334155] to-transparent"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
              <div className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                <Calendar className="w-5 h-5" />
              </div>
              <span style={{ fontWeight: 600 }}>Due Date</span>
            </div>
            <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 700 }}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-[#334155] to-transparent"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
              <div className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                <Clock className="w-5 h-5" />
              </div>
              <span style={{ fontWeight: 600 }}>Estimated Time</span>
            </div>
            <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 700 }}>
              {formatTime(task.estimatedTime)}
            </span>
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
          <h4 className="text-[#0F172A] dark:text-white mb-4" style={{ fontWeight: 700, fontSize: '16px' }}>
            Priority
          </h4>
          <div className={`inline-flex items-center gap-3 ${priorityColors.bg} px-5 py-3 rounded-2xl border ${priorityColors.border}`}>
            <div className={`w-2.5 h-2.5 ${priorityColors.dot} rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}></div>
            <span className={priorityColors.text} style={{ fontWeight: 700, textTransform: 'capitalize' }}>
              {task.priority || 'Medium'}
            </span>
          </div>
        </div>

        {/* Delete Task Button */}
        <div className="px-6 pb-8">
          <button
            onClick={handleDeleteTask}
            disabled={updating}
            className="w-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white py-4 rounded-3xl shadow-[0_15px_50px_rgba(239,68,68,0.35)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 700, fontSize: '16px' }}
          >
            <Trash2 className="w-5 h-5" />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}