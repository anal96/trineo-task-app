import { House, ListTodo, Plus, User, Users } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: House },
    { id: "tasks", label: "Tasks", icon: ListTodo },
    { id: "add", label: "Add", icon: Plus },
    { id: "team-progress", label: "Team", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-50"
      style={{ 
        paddingLeft: 'max(0px, env(safe-area-inset-left))',
        paddingRight: 'max(0px, env(safe-area-inset-right))'
      }}
    >
      <div 
        className="w-full bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl rounded-t-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border-t border-white/20 dark:border-[#334155]/50 px-6 py-1.5 pointer-events-auto"
        style={{ 
          paddingBottom: 'max(6px, env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-0.5 transition-all relative min-h-[45px] min-w-[45px] touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1E40AF] rounded-full" />
                )}
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-[0_4px_20px_rgba(30,64,175,0.4)]"
                      : "text-[#64748B] dark:text-[#94A3B8] active:bg-[#F8FAFC] dark:active:bg-[#334155]"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span
                  className={`text-[10px] transition-colors ${
                    isActive ? "text-[#1E40AF] dark:text-[#60A5FA]" : "text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                  style={{ fontWeight: isActive ? 700 : 500 }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}