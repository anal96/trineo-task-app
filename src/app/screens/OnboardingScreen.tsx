import { CircleCheck, Target, TrendingUp } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] px-6 py-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-[0_10px_40px_rgba(30,64,175,0.4)] overflow-hidden mb-8">
          <img 
            src="/icon-192.png" 
            alt="Trineo Tasks Logo" 
            className="w-full h-full object-contain p-3"
          />
        </div>
        <h1 className="text-[#0F172A] dark:text-white mb-3 text-center" style={{ fontSize: '28px', fontWeight: 700 }}>
          Manage Your Tasks
        </h1>
        <p className="text-[#64748B] dark:text-[#94A3B8] text-center mb-12 max-w-sm">
          Track your projects, monitor progress, and achieve your goals with Trineo Tasks
        </p>

        <div className="space-y-6 w-full max-w-sm mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1E40AF]/10 dark:bg-[#1E40AF]/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-[#1E40AF] dark:text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] dark:text-white mb-1" style={{ fontWeight: 600 }}>
                Set Clear Goals
              </h3>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
                Define your tasks and projects with precision
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 dark:bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-[#22C55E] dark:text-[#4ADE80]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] dark:text-white mb-1" style={{ fontWeight: 600 }}>
                Track Progress
              </h3>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
                Monitor your advancement in real-time
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
              <CircleCheck className="w-6 h-6 text-[#3B82F6] dark:text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] dark:text-white mb-1" style={{ fontWeight: 600 }}>
                Achieve Success
              </h3>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
                Complete tasks and celebrate milestones
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
        style={{ fontWeight: 600 }}
      >
        Let's Start
      </button>
    </div>
  );
}