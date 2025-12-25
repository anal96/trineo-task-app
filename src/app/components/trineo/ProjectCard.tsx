import { Folder } from "lucide-react";

interface ProjectCardProps {
  name: string;
  type: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  color?: string;
  onClick?: () => void;
}

export function ProjectCard({
  name,
  type,
  progress,
  tasksCompleted,
  totalTasks,
  color = "#1E40AF",
  onClick,
}: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 cursor-pointer hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_20px_50px_rgb(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 min-w-[220px] hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ 
            backgroundColor: `${color}15`,
            boxShadow: `0 4px 20px ${color}20`
          }}
        >
          <Folder className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <h4 className="text-[#0F172A] dark:text-white mb-1" style={{ fontWeight: 700, fontSize: '15px' }}>
            {name}
          </h4>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>{type}</p>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B] dark:text-[#94A3B8]" style={{ fontWeight: 500 }}>
            {tasksCompleted}/{totalTasks} Tasks
          </span>
          <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 700, fontSize: '15px' }}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-2.5 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 shadow-sm"
            style={{
              width: `${progress}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}