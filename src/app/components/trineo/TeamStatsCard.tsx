import { Users, Target, CheckCircle2, TrendingUp, Award, Clock } from "lucide-react";

interface TeamStatsCardProps {
  stats: {
    totalMembers: number;
    totalTasks: number;
    completedTasks: number;
    averageProgress: number;
    topPerformer: string;
    teamEfficiency: number;
  };
}

export function TeamStatsCard({ stats }: TeamStatsCardProps) {
  const completionRate =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const statItems = [
    {
      icon: Users,
      label: "Team Members",
      value: stats.totalMembers,
      color: "from-[#1E40AF] to-[#2563EB]",
      bgColor: "bg-[#1E40AF]/10 dark:bg-[#1E40AF]/20",
    },
    {
      icon: Target,
      label: "Total Tasks",
      value: stats.totalTasks,
      color: "from-[#3B82F6] to-[#2563EB]",
      bgColor: "bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: stats.completedTasks,
      color: "from-[#22C55E] to-[#16A34A]",
      bgColor: "bg-[#22C55E]/10 dark:bg-[#22C55E]/20",
    },
    {
      icon: TrendingUp,
      label: "Avg Progress",
      value: `${stats.averageProgress}%`,
      color: "from-[#F59E0B] to-[#D97706]",
      bgColor: "bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 text-[#1E40AF] dark:text-[#60A5FA]`} />
                </div>
              </div>
              <p
                className={`text-2xl font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent mb-1`}
              >
                {item.value}
              </p>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 600 }}>
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Team Efficiency & Top Performer */}
      <div className="grid grid-cols-2 gap-4">
        {/* Team Efficiency */}
        <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-2xl p-5 shadow-[0_8px_30px_rgba(30,64,175,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-xs" style={{ fontWeight: 600 }}>
                Team Efficiency
              </span>
            </div>
            <p className="text-white text-3xl mb-1" style={{ fontWeight: 800 }}>
              {stats.teamEfficiency}%
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mt-3">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.teamEfficiency}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <span className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 600 }}>
              Top Performer
            </span>
          </div>
          <p className="text-[#0F172A] dark:text-white text-lg mb-1" style={{ fontWeight: 700 }}>
            {stats.topPerformer || "N/A"}
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
            Leading the team
          </p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl p-5 shadow-[0_8px_30px_rgba(34,197,94,0.3)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm" style={{ fontWeight: 600 }}>
                Completion Rate
              </span>
            </div>
            <p className="text-white text-3xl mb-2" style={{ fontWeight: 800 }}>
              {completionRate}%
            </p>
            <p className="text-white/70 text-xs">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

