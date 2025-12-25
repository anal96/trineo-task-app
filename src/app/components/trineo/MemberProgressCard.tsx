import { Award, Clock, CheckCircle2, Target, TrendingUp } from "lucide-react";

interface MemberProgressCardProps {
  member: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    stats: {
      totalTasks: number;
      completedTasks: number;
      inProgressTasks: number;
      todoTasks: number;
      totalProgress: number;
      averageCompletionTime: number;
    };
  };
  rank?: number;
  isCurrentUser?: boolean;
}

export function MemberProgressCard({ member, rank, isCurrentUser }: MemberProgressCardProps) {
  const completionRate =
    member.stats.totalTasks > 0
      ? Math.round((member.stats.completedTasks / member.stats.totalTasks) * 100)
      : 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-[#22C55E] to-[#16A34A]";
    if (progress >= 50) return "from-[#3B82F6] to-[#2563EB]";
    if (progress >= 25) return "from-[#F59E0B] to-[#D97706]";
    return "from-[#64748B] to-[#475569]";
  };

  return (
    <div
      className={`bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border ${
        isCurrentUser
          ? "border-[#1E40AF]/50 dark:border-[#60A5FA]/50 ring-2 ring-[#1E40AF]/20 dark:ring-[#60A5FA]/20"
          : "border-white/30 dark:border-[#334155]/50"
      } hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-lg ${
              isCurrentUser ? "ring-2 ring-[#1E40AF] dark:ring-[#60A5FA]" : ""
            }`}
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-white" style={{ fontSize: "18px", fontWeight: 800 }}>
                {getInitials(member.name)}
              </span>
            )}
          </div>
          {rank && rank <= 3 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg border-2 border-white dark:border-[#1E293B]">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="text-[#0F172A] dark:text-white truncate"
              style={{ fontSize: "18px", fontWeight: 700 }}
            >
              {member.name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-[#1E40AF] dark:text-[#60A5FA]" style={{ fontWeight: 600 }}>
                  (You)
                </span>
              )}
            </h4>
            {rank && (
              <span
                className="flex-shrink-0 px-2.5 py-0.5 rounded-lg bg-[#1E40AF]/10 dark:bg-[#60A5FA]/20 text-[#1E40AF] dark:text-[#60A5FA] text-xs"
                style={{ fontWeight: 700 }}
              >
                #{rank}
              </span>
            )}
          </div>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm truncate" style={{ fontWeight: 500 }}>
            {member.email}
          </p>
        </div>

        {/* Progress Percentage */}
        <div className="flex-shrink-0 text-right">
          <div
            className={`text-2xl font-bold bg-gradient-to-br ${getProgressColor(member.stats.totalProgress)} bg-clip-text text-transparent`}
          >
            {member.stats.totalProgress}%
          </div>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
            Progress
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-[#E2E8F0]/70 dark:bg-[#334155]/70 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(member.stats.totalProgress)}`}
            style={{ width: `${member.stats.totalProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
          </div>
          <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 700 }}>
            {member.stats.totalTasks}
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
            Total
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
          </div>
          <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 700 }}>
            {member.stats.completedTasks}
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
            Done
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 700 }}>
            {member.stats.inProgressTasks}
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
            Active
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
          <p className="text-[#0F172A] dark:text-white text-sm" style={{ fontWeight: 700 }}>
            {completionRate}%
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-xs" style={{ fontWeight: 500 }}>
            Rate
          </p>
        </div>
      </div>
    </div>
  );
}


