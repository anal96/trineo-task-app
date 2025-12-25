import { BarChart3 } from "lucide-react";

interface ProgressChartProps {
  members: Array<{
    _id: string;
    name: string;
    stats: {
      totalProgress: number;
      completedTasks: number;
      totalTasks: number;
    };
  }>;
}

export function ProgressChart({ members }: ProgressChartProps) {
  const maxProgress = Math.max(...members.map((m) => m.stats.totalProgress), 100);
  const sortedMembers = [...members].sort((a, b) => b.stats.totalProgress - a.stats.totalProgress);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-[#22C55E]";
    if (progress >= 50) return "bg-[#3B82F6]";
    if (progress >= 25) return "bg-[#F59E0B]";
    return "bg-[#64748B]";
  };

  return (
    <div className="space-y-4">
      {sortedMembers.length > 0 ? (
        sortedMembers.map((member) => (
          <div key={member._id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs" style={{ fontWeight: 800 }}>
                    {getInitials(member.name)}
                  </span>
                </div>
                <div>
                  <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 600 }}>
                    {member.name}
                  </p>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
                    {member.stats.completedTasks}/{member.stats.totalTasks} tasks
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 700 }}>
                  {member.stats.totalProgress}%
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-[#E2E8F0]/70 dark:bg-[#334155]/70 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(member.stats.totalProgress)}`}
                  style={{
                    width: `${(member.stats.totalProgress / maxProgress) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-[#64748B] dark:text-[#94A3B8] mx-auto mb-3 opacity-50" />
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">No data available</p>
        </div>
      )}
    </div>
  );
}


