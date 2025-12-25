import React, { useState, useEffect } from "react";
import { LogOut, Mail, Calendar, Award, Moon, Sun, ChevronRight, Folder, X, Save, Bell, Users } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { authAPI, tasksAPI, projectsAPI, userAPI } from "../../services/api";
import { NotificationService } from "../../services/notifications";

interface ProfileScreenProps {
  onLogout: () => void;
  onViewTeamProgress?: () => void;
}

export function ProfileScreen({ onLogout, onViewTeamProgress }: ProfileScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    loadProfileData();
    // Check notification permission
    if (NotificationService.isSupported()) {
      setNotificationPermission(NotificationService.getPermission());
    }
  }, []);

  // Refresh when task is added
  useEffect(() => {
    let refreshTimeout: number;
    const handleTaskAdded = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = window.setTimeout(() => {
        loadProfileData();
      }, 300);
    };
    window.addEventListener('taskAdded', handleTaskAdded);
    return () => {
      window.removeEventListener('taskAdded', handleTaskAdded);
      clearTimeout(refreshTimeout);
    };
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Try to fetch from API
        try {
          const userData = await authAPI.verifySession();
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }

      // Load task statistics
      const taskStats = await tasksAPI.getStats();
      setStats({
        completed: taskStats.completed || 0,
        inProgress: taskStats.inProgress || 0,
        totalProjects: 0, // Will be updated below
      });

      // Load project count
      const projects = await projectsAPI.getAll();
      setStats(prev => ({
        ...prev,
        totalProjects: projects.length || 0,
      }));
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleEditClick = () => {
    if (user) {
      setEditFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setEditError("");
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      setEditError("Name is required");
      return;
    }

    setSaving(true);
    setEditError("");
    
    try {
      const updatedUser = await userAPI.update({
        name: editFormData.name.trim(),
      });
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setEditError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationPermission = async () => {
    if (!NotificationService.isSupported()) {
      alert('Notifications are not supported in this browser');
      return;
    }

    const permission = await NotificationService.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      // Test notification
      await NotificationService.showNotification('Notifications Enabled', {
        body: 'You will now receive notifications for overdue tasks and tasks due today.',
        tag: 'notification-enabled'
      });
    } else if (permission === 'denied') {
      alert('Notification permission was denied. Please enable it in your browser settings.');
    }
  };

  const userStats = [
    {
      label: "Completed Tasks",
      value: stats.completed.toString(),
      color: "#22C55E",
      icon: Award,
    },
    {
      label: "In Progress",
      value: stats.inProgress.toString(),
      color: "#F59E0B",
      icon: Calendar,
    },
    {
      label: "Total Projects",
      value: stats.totalProjects.toString(),
      color: "#1E40AF",
      icon: Folder,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto" style={{ paddingBottom: '52px' }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] px-6 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl"></div>
        <h2 className="text-white text-center relative z-10" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Profile
        </h2>
      </div>

      {/* Profile Card - Overlapping */}
      <div className="px-6 -mt-16">
        <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/30 dark:border-[#334155]/50">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-[24px] bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] flex items-center justify-center mb-5 shadow-[0_10px_40px_rgba(30,64,175,0.4)]">
              <span className="text-white" style={{ fontSize: '40px', fontWeight: 800 }}>
                {loading ? '...' : getUserInitial(user?.name || 'User')}
              </span>
            </div>

            {/* User Info */}
            <h3 className="text-[#0F172A] dark:text-white mb-2" style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.3px' }}>
              {loading ? 'Loading...' : (user?.name || 'User')}
            </h3>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-2" style={{ fontWeight: 600 }}>
              {user?.role || 'Team Member'}
            </p>
            <div className="flex items-center gap-2.5 text-[#64748B] dark:text-[#94A3B8] text-sm">
              <div className="w-7 h-7 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                <Mail className="w-4 h-4" />
              </div>
              <span style={{ fontWeight: 600 }}>{loading ? '...' : (user?.email || 'No email')}</span>
            </div>

            {/* Role Badge */}
            {user && (
              <div className="mt-5 bg-gradient-to-br from-[#1E40AF]/15 to-[#2563EB]/10 px-6 py-3 rounded-2xl border border-[#1E40AF]/20">
                <span className="text-[#1E40AF] dark:text-[#60A5FA]" style={{ fontWeight: 700 }}>
                  {user.role || 'Member'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 py-8">
        <h4 className="text-[#0F172A] dark:text-white mb-5" style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>
          Task Statistics
        </h4>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-[#334155] animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-[#334155] rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-12 bg-gray-200 dark:bg-[#334155] rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {userStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ 
                        backgroundColor: `${stat.color}15`,
                        boxShadow: `0 4px 20px ${stat.color}20`
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
                      {stat.label}
                    </span>
                  </div>
                  <span
                    className="text-[#0F172A] dark:text-white"
                    style={{ fontSize: '28px', fontWeight: 800 }}
                  >
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="px-6 pb-8">
        <h4 className="text-[#0F172A] dark:text-white mb-5" style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>
          Account
        </h4>
        <div className="space-y-3">
          <button 
            onClick={handleEditClick}
            className="w-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
          >
            <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
              Edit Profile
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
              <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
            </div>
          </button>

          {onViewTeamProgress && (
            <button 
              onClick={onViewTeamProgress}
              className="w-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#2563EB] flex items-center justify-center shadow-sm">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
                  Team Progress
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
              </div>
            </button>
          )}

          <button 
            onClick={toggleTheme}
            className="w-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#1E40AF]" />
                )}
              </div>
              <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
              <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
            </div>
          </button>

          {/* Notifications Toggle */}
          {NotificationService.isSupported() && (
            <button
              onClick={handleNotificationPermission}
              className="w-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                  <Bell className={`w-4 h-4 ${
                    notificationPermission === 'granted' 
                      ? 'text-[#22C55E]' 
                      : notificationPermission === 'denied'
                      ? 'text-[#EF4444]'
                      : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[#0F172A] dark:text-white block" style={{ fontWeight: 600, fontSize: '15px' }}>
                    Push Notifications
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-xs block mt-0.5">
                    {notificationPermission === 'granted' 
                      ? 'Enabled' 
                      : notificationPermission === 'denied'
                      ? 'Disabled - Enable in settings'
                      : 'Tap to enable'}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
                <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
              </div>
            </button>
          )}

          <button className="w-full bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 flex items-center justify-between hover:shadow-[0_15px_45px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_15px_45px_rgb(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-[#1E293B]/80">
            <span className="text-[#0F172A] dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
              Help & Support
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50">
              <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
            </div>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-8">
        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white py-4.5 rounded-3xl shadow-[0_15px_50px_rgba(239,68,68,0.35)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
          style={{ fontWeight: 700, fontSize: '16px' }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#0F172A] dark:text-white" style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                Edit Profile
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditError("");
                }}
                className="w-10 h-10 rounded-xl bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-[#475569]/50 hover:bg-white/70 dark:hover:bg-[#475569]/70 transition-all"
              >
                <X className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '14px' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:bg-white/70 dark:focus:bg-[#334155]/70"
                  style={{ fontWeight: 500 }}
                  disabled={saving}
                />
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-[#0F172A] dark:text-white mb-3" style={{ fontWeight: 700, fontSize: '14px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  disabled
                  className="w-full px-5 py-4 bg-white/30 dark:bg-[#334155]/30 backdrop-blur-sm border border-white/20 dark:border-[#475569]/30 rounded-2xl text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed"
                  style={{ fontWeight: 500 }}
                />
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">Email cannot be changed</p>
              </div>

              {/* Error Message */}
              {editError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  {editError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditError("");
                  }}
                  disabled={saving}
                  className="flex-1 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm text-[#64748B] dark:text-[#94A3B8] py-3.5 rounded-2xl transition-all duration-300 border border-white/20 dark:border-[#475569]/50 hover:bg-white/70 dark:hover:bg-[#475569]/70 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !editFormData.name.trim()}
                  className="flex-1 bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontWeight: 700 }}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}