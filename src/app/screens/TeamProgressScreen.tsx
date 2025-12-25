import { useState, useEffect } from "react";
import { ChevronLeft, Users, TrendingUp, Award, Clock, Target, BarChart3, Calendar, Filter } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { teamAPI, authAPI } from "../../services/api";
import { MemberProgressCard } from "../components/trineo/MemberProgressCard";
import { ProgressChart } from "../components/trineo/ProgressChart";
import { TeamStatsCard } from "../components/trineo/TeamStatsCard";

interface TeamProgressScreenProps {
  onBack: () => void;
}

interface TeamMember {
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
}

interface TeamStats {
  totalMembers: number;
  totalTasks: number;
  completedTasks: number;
  averageProgress: number;
  topPerformer: string;
  teamEfficiency: number;
}

export function TeamProgressScreen({ onBack }: TeamProgressScreenProps) {
  const { theme } = useTheme();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "top" | "active">("all");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadTeamData();
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, [timeRange]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [membersData, statsData] = await Promise.all([
        teamAPI.getMembers(),
        teamAPI.getTeamStats(timeRange),
      ]);
      setMembers(membersData);
      setTeamStats(statsData);
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMembers = () => {
    let filtered = [...members];

    if (selectedFilter === "top") {
      filtered = filtered
        .sort((a, b) => b.stats.totalProgress - a.stats.totalProgress)
        .slice(0, 5);
    } else if (selectedFilter === "active") {
      filtered = filtered.filter((m) => m.stats.inProgressTasks > 0);
    }

    return filtered;
  };

  const filters = [
    { id: "all", label: "All Members" },
    { id: "top", label: "Top Performers" },
    { id: "active", label: "Active Now" },
  ];

  const timeRanges = [
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "all", label: "All Time" },
  ];

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto"
      style={{ paddingBottom: "52px" }}
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl px-6 pt-10 pb-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/20 dark:border-[#334155]/50">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
          >
            <ChevronLeft className="w-5 h-5 text-[#0F172A] dark:text-white" />
          </button>
          <div className="flex-1">
            <h2
              className="text-[#0F172A] dark:text-white"
              style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}
            >
              Team Progress
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">
              Analyze team performance and productivity
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as "week" | "month" | "all")}
              className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 ${
                timeRange === range.id
                  ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_4px_20px_rgba(30,64,175,0.3)]"
                  : "bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl text-[#64748B] dark:text-[#94A3B8] hover:bg-white/80 dark:hover:bg-[#1E293B]/80 border border-white/30 dark:border-[#334155]/50"
              }`}
              style={{ fontWeight: 600, fontSize: "13px" }}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as "all" | "top" | "active")}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                selectedFilter === filter.id
                  ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_4px_20px_rgba(30,64,175,0.3)]"
                  : "bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl text-[#64748B] dark:text-[#94A3B8] hover:bg-white/80 dark:hover:bg-[#1E293B]/80 border border-white/30 dark:border-[#334155]/50"
              }`}
              style={{ fontWeight: 700, fontSize: "14px" }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#94A3B8]">Loading team data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Team Statistics Overview */}
          {teamStats && (
            <div className="px-6 py-6">
              <TeamStatsCard stats={teamStats} />
            </div>
          )}

          {/* Progress Chart */}
          {members.length > 0 && (
            <div className="px-6 mb-6">
              <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className="text-[#0F172A] dark:text-white"
                    style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px" }}
                  >
                    Team Progress Overview
                  </h3>
                  <BarChart3 className="w-5 h-5 text-[#1E40AF] dark:text-[#60A5FA]" />
                </div>
                <ProgressChart members={members} />
              </div>
            </div>
          )}

          {/* Team Members List */}
          <div className="px-6 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-[#0F172A] dark:text-white"
                style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px" }}
              >
                Team Members
              </h3>
              <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8] text-sm">
                <Users className="w-4 h-4" />
                <span style={{ fontWeight: 600 }}>{getFilteredMembers().length}</span>
              </div>
            </div>

            {getFilteredMembers().length > 0 ? (
              <div className="space-y-4">
                {getFilteredMembers().map((member, index) => (
                  <MemberProgressCard
                    key={member._id}
                    member={member}
                    rank={selectedFilter === "top" ? index + 1 : undefined}
                    isCurrentUser={currentUser?.id === member._id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-3xl bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/30 dark:border-[#334155]/50 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Users className="w-8 h-8 text-[#64748B] dark:text-[#94A3B8]" />
                </div>
                <p className="text-[#64748B] dark:text-[#94A3B8]" style={{ fontWeight: 500 }}>
                  No team members found
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}


