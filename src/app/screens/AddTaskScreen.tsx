import { useState, useEffect } from "react";
import { ChevronLeft, Calendar } from "lucide-react";
import { tasksAPI, projectsAPI } from "../../services/api";

interface AddTaskScreenProps {
  onBack: () => void;
  onSave: () => void;
}

export function AddTaskScreen({ onBack, onSave }: AddTaskScreenProps) {
  const [taskType, setTaskType] = useState<"task" | "project">("task");
  const [formData, setFormData] = useState({
    name: "",
    type: "Website",
    description: "",
    startDate: "",
    endDate: "",
    projectId: "",
    priority: "medium",
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskType === "task") {
      loadProjects();
    }
  }, [taskType]);

  const loadProjects = async () => {
    try {
      const projectsData = await projectsAPI.getAll();
      setProjects(projectsData);
      // Auto-select first project if available
      if (projectsData.length > 0 && !formData.projectId) {
        setFormData(prev => ({ ...prev, projectId: projectsData[0]._id }));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (taskType === "task") {
        // Create task
        if (!formData.projectId) {
          setError("Please select a project");
          setLoading(false);
          return;
        }

        // Calculate estimated time from dates if provided
        let estimatedTime = 0;
        if (formData.startDate && formData.endDate) {
          const start = new Date(formData.startDate);
          const end = new Date(formData.endDate);
          const diffMs = end.getTime() - start.getTime();
          estimatedTime = Math.max(0, Math.round(diffMs / (1000 * 60))); // Convert to minutes
        }

        await tasksAPI.create({
          title: formData.name,
          description: formData.description,
          projectId: formData.projectId,
          status: "todo",
          priority: formData.priority,
          estimatedTime: estimatedTime,
          dueDate: formData.endDate || undefined,
        });
      } else {
        // Create project
        await projectsAPI.create({
          name: formData.name,
          type: formData.type,
          color: "#1E40AF", // Default color
        });
      }

      // Success - go back and refresh
      onSave();
    } catch (error: any) {
      console.error('Error saving:', error);
      setError(error.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const types = ["Website", "App", "Backend", "Design", "Marketing"];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto" style={{ paddingBottom: '52px' }}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl px-6 pt-10 pb-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/20 dark:border-[#334155]/30">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
          >
            <ChevronLeft className="w-5 h-5 text-[#0F172A] dark:text-white" />
          </button>
          <h2 className="text-[#0F172A] dark:text-white" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Add New
          </h2>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-3 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-2xl p-2 rounded-2xl border border-white/30 dark:border-[#334155]/50">
          <button
            onClick={() => setTaskType("task")}
            className={`flex-1 py-3.5 rounded-xl transition-all duration-300 ${
              taskType === "task"
                ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_6px_25px_rgba(30,64,175,0.3)]"
                : "text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#334155]"
            }`}
            style={{ fontWeight: 700 }}
          >
            Task
          </button>
          <button
            onClick={() => setTaskType("project")}
            className={`flex-1 py-3.5 rounded-xl transition-all duration-300 ${
              taskType === "project"
                ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_6px_25px_rgba(30,64,175,0.3)]"
                : "text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#334155]"
            }`}
            style={{ fontWeight: 700 }}
          >
            Project
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-8">
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 space-y-7">
          {/* Name */}
          <div>
            <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '15px' }}>
              {taskType === "task" ? "Task Name" : "Project Name"}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={`Enter ${taskType} name`}
              className="w-full px-5 py-4 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:bg-white/70 dark:focus:bg-[#334155]/70"
              style={{ fontWeight: 500 }}
              required
            />
          </div>

          {taskType === "project" ? (
            /* Project Type */
            <div>
              <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '15px' }}>
                Type
              </label>
              <div className="flex flex-wrap gap-2.5">
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                      formData.type === type
                        ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_4px_20px_rgba(30,64,175,0.3)]"
                        : "bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-white/70 dark:hover:bg-[#475569]/70 border border-white/20 dark:border-[#475569]/50"
                    }`}
                    style={{ fontWeight: 700 }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Task Project Selection */
            <div>
              <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '15px' }}>
                Project
              </label>
              {projects.length > 0 ? (
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-5 py-4 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm text-[#0F172A] dark:text-white focus:bg-white/70 dark:focus:bg-[#334155]/70"
                  style={{ fontWeight: 500 }}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name} ({project.type})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-5 py-4 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl text-[#64748B] dark:text-[#94A3B8]">
                  No projects available. Create a project first.
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '15px' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description"
              rows={4}
              className="w-full px-5 py-4 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all resize-none shadow-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:bg-white/70 dark:focus:bg-[#334155]/70"
              style={{ fontWeight: 500 }}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '14px' }}>
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm text-sm text-[#0F172A] dark:text-white focus:bg-white/70 dark:focus:bg-[#334155]/70"
                  style={{ fontWeight: 600 }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '14px' }}>
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm text-sm text-[#0F172A] dark:text-white focus:bg-white/70 dark:focus:bg-[#334155]/70"
                  style={{ fontWeight: 600 }}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mt-6">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (taskType === "task" && !formData.projectId)}
          className="w-full bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] text-white py-4.5 rounded-3xl shadow-[0_15px_50px_rgba(30,64,175,0.35)] hover:shadow-[0_20px_60px_rgba(30,64,175,0.45)] hover:-translate-y-0.5 transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ fontWeight: 700, fontSize: '16px' }}
        >
          {loading ? "Saving..." : `Add ${taskType === "task" ? "Task" : "Project"}`}
        </button>
      </form>
    </div>
  );
}