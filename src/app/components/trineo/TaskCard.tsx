import { Clock } from "lucide-react";

interface TaskCardProps {
  title: string;
  project: string;
  time: string;
  progress: number;
  status?: "todo" | "in-progress" | "completed";
  onClick?: () => void;
}

export function TaskCard({
  title,
  project,
  time,
  progress,
  status = "in-progress",
  onClick,
}: TaskCardProps) {
  const statusColors = {
    todo: "bg-[#64748B]",
    "in-progress": "bg-[#F59E0B]",
    completed: "bg-[#22C55E]",
  };

  const statusLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 cursor-pointer hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_20px_50px_rgb(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-[#0F172A] dark:text-white mb-1.5" style={{ fontWeight: 600, fontSize: '16px' }}>
            {title}
          </h4>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">{project}</p>
        </div>
        <div className={`${statusColors[status]} px-3.5 py-1.5 rounded-full shadow-sm`}>
          <span className="text-white text-xs" style={{ fontWeight: 600 }}>
            {statusLabels[status]}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/20 dark:border-[#334155]/30 flex items-center justify-center">
          <Clock className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
        </div>
        <span className="text-[#64748B] dark:text-[#94A3B8] text-sm" style={{ fontWeight: 500 }}>{time}</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B] dark:text-[#94A3B8]" style={{ fontWeight: 500 }}>Progress</span>
          <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 700, fontSize: '15px' }}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-2.5 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#3B82F6] h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}