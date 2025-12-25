import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/api";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.login(email, password);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] px-6 py-8">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-[0_10px_40px_rgba(30,64,175,0.4)] overflow-hidden">
            <img 
              src="/icon-192.png" 
              alt="Trineo Tasks Logo" 
              className="w-full h-full object-contain p-3"
            />
          </div>
        </div>
        
        <h1 className="text-[#0F172A] dark:text-white mb-2 text-center" style={{ fontSize: '28px', fontWeight: 700 }}>
          Welcome Back
        </h1>
        <p className="text-[#64748B] dark:text-[#94A3B8] text-center mb-8">
          Sign in to continue to Trineo Tasks
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/30 dark:border-[#334155]/50 space-y-5">
            <div>
              <label className="block text-[#0F172A] dark:text-white mb-2" style={{ fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-all text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]"
                required
              />
            </div>

            <div>
              <label className="block text-[#0F172A] dark:text-white mb-2" style={{ fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-[#334155]/50 backdrop-blur-sm border border-white/30 dark:border-[#475569]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-all pr-12 text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                />
                <span className="text-[#64748B] text-sm" style={{ fontWeight: 500 }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  // Placeholder for forgot password
                  alert("Forgot password feature coming soon!");
                }}
                className="text-[#1E40AF] text-sm hover:underline"
                style={{ fontWeight: 600 }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 600 }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <p className="text-center text-[#64748B] dark:text-[#94A3B8] text-sm mt-8">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}
