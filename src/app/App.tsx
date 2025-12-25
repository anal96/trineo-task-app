import { useState, useEffect } from "react";
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { TasksScreen } from "./screens/TasksScreen";
import { TaskDetailScreen } from "./screens/TaskDetailScreen";
import { AddTaskScreen } from "./screens/AddTaskScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { TeamProgressScreen } from "./screens/TeamProgressScreen";
import { BottomNav } from "./components/trineo/BottomNav";
import { InstallPrompt } from "./components/trineo/InstallPrompt";
import { authAPI } from "../services/api";

type Screen =
  | "splash"
  | "onboarding"
  | "login"
  | "home"
  | "tasks"
  | "task-detail"
  | "add"
  | "profile"
  | "team-progress";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0 to 1, tracks swipe progress
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentScreen("task-detail");
  };

  const handleTabChange = (tab: string, direction?: 'left' | 'right') => {
    if (direction) {
      setSwipeDirection(direction);
    }
    
    setActiveTab(tab);
    
    // Small delay to allow animation
    setTimeout(() => {
      if (tab === "home") {
        setCurrentScreen("home");
      } else if (tab === "tasks") {
        setCurrentScreen("tasks");
      } else if (tab === "add") {
        setCurrentScreen("add");
      } else if (tab === "team-progress") {
        setCurrentScreen("team-progress");
      } else if (tab === "profile") {
        setCurrentScreen("profile");
      }
      
      // Reset swipe direction after animation completes
      setTimeout(() => setSwipeDirection(null), 300);
    }, direction ? 0 : 0);
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleAddTaskSave = () => {
    // Navigate first, then trigger refresh after a short delay
    setCurrentScreen("home");
    setActiveTab("home");
    
    // Trigger refresh event after navigation completes
    setTimeout(() => {
      window.dispatchEvent(new Event('taskAdded'));
    }, 500);
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentScreen("login");
    setActiveTab("home");
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authAPI.verifySession();
        if (user) {
          // User has valid session, go to home
          console.log('✅ Session found, auto-login:', user.name);
          setCurrentScreen("home");
        } else {
          // No valid session, check if user has seen onboarding
          const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
          if (hasSeenOnboarding === 'true') {
            setCurrentScreen("login");
          } else {
            setCurrentScreen("splash");
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding === 'true') {
          setCurrentScreen("login");
        } else {
          setCurrentScreen("splash");
        }
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const showBottomNav =
    currentScreen === "home" ||
    currentScreen === "tasks" ||
    currentScreen === "add" ||
    currentScreen === "team-progress" ||
    currentScreen === "profile";

  // Tab order for swipe navigation
  const tabOrder = ["home", "tasks", "add", "team-progress", "profile"];

  // Handle swipe navigation
  const handleSwipe = () => {
    if (!touchStart || !touchEnd || !showBottomNav || !isSwiping) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const absX = Math.abs(distanceX);
    const absY = Math.abs(distanceY);

    // Minimum swipe distance (30% of screen width)
    const screenWidth = window.innerWidth;
    const minSwipeDistance = screenWidth * 0.3;

    // Only handle horizontal swipes (horizontal distance must be greater than vertical)
    if (absX < minSwipeDistance || absY > absX) {
      return;
    }

    const isLeftSwipe = distanceX > 0;
    const isRightSwipe = distanceX < 0;
    const currentIndex = tabOrder.indexOf(activeTab);

    if (isLeftSwipe && currentIndex < tabOrder.length - 1) {
      // Swipe left - go to next tab
      const nextTab = tabOrder[currentIndex + 1];
      handleTabChange(nextTab, 'left');
    } else if (isRightSwipe && currentIndex > 0) {
      // Swipe right - go to previous tab
      const prevTab = tabOrder[currentIndex - 1];
      handleTabChange(prevTab, 'right');
    }
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!showBottomNav) return;
    const touch = e.targetTouches[0];
    setTouchEnd(null);
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
    setIsSwiping(false);
    setSwipeProgress(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!showBottomNav || !touchStart) return;
    
    const touch = e.targetTouches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    const deltaX = touchStart.x - currentX;
    const deltaY = touchStart.y - currentY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Only track horizontal swipes
    if (absX > 5 && absX > absY) {
      e.preventDefault(); // Prevent scrolling during horizontal swipe
      setIsSwiping(true);
      setTouchEnd({ x: currentX, y: currentY });
      
      // Calculate swipe progress (0 to 1) - more responsive
      const screenWidth = window.innerWidth;
      const progress = Math.min(Math.abs(deltaX) / (screenWidth * 0.8), 1);
      setSwipeProgress(progress);
      
      // Set direction
      if (deltaX > 0) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection('right');
      }
    }
  };

  const onTouchEnd = () => {
    if (!showBottomNav) return;
    
    if (isSwiping && swipeProgress > 0.3) {
      // Only complete swipe if progress is significant
      handleSwipe();
    } else if (isSwiping) {
      // Snap back if swipe wasn't far enough
      setIsSwiping(false);
      setSwipeProgress(0);
      setTimeout(() => setSwipeDirection(null), 300);
    }
    
    // Reset swipe state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Show splash while checking session
  if (isCheckingSession) {
    return (
      <div className="relative w-full h-full bg-background overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-background overflow-hidden" 
      style={{ 
        height: '100vh', 
        width: '100%'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className="w-full h-full overflow-hidden scrollbar-hide relative" 
        style={{ paddingBottom: '52px' }}
      >
        {currentScreen === "splash" && (
          <SplashScreen onComplete={() => setCurrentScreen("onboarding")} />
        )}

        {currentScreen === "onboarding" && (
          <OnboardingScreen onComplete={() => {
            localStorage.setItem('hasSeenOnboarding', 'true');
            setCurrentScreen("login");
          }} />
        )}

        {currentScreen === "login" && (
          <LoginScreen onLogin={() => setCurrentScreen("home")} />
        )}

        {showBottomNav && (
          <>
            {/* Current Screen */}
            <div 
              key={currentScreen}
              className="absolute inset-0 w-full h-full overflow-y-auto"
              style={{
                transform: isSwiping 
                  ? swipeDirection === 'left' 
                    ? `translateX(-${swipeProgress * 100}%)` 
                    : swipeDirection === 'right'
                    ? `translateX(${swipeProgress * 100}%)`
                    : 'translateX(0)'
                  : 'translateX(0)',
                opacity: isSwiping ? 1 - swipeProgress * 0.5 : 1,
                transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: isSwiping ? 'transform, opacity' : 'auto',
              }}
            >
        {currentScreen === "home" && (
          <HomeScreen
            onTaskClick={handleTaskClick}
            onViewTasks={() => {
              setCurrentScreen("tasks");
              setActiveTab("tasks");
            }}
            onAddTask={() => {
              setCurrentScreen("add");
              setActiveTab("add");
            }}
          />
        )}

        {currentScreen === "tasks" && (
          <TasksScreen
            onTaskClick={handleTaskClick}
            onBack={handleBackToHome}
          />
        )}

            {currentScreen === "add" && (
              <AddTaskScreen
                onBack={handleBackToHome}
                onSave={handleAddTaskSave}
              />
            )}

            {currentScreen === "team-progress" && (
              <TeamProgressScreen
                onBack={handleBackToHome}
              />
            )}

            {currentScreen === "profile" && (
              <ProfileScreen 
                onLogout={handleLogout} 
                onViewTeamProgress={() => {
                  setCurrentScreen("team-progress");
                  setActiveTab("team-progress");
                }}
              />
            )}
            </div>

            {/* Next/Previous Screen Preview During Swipe */}
            {isSwiping && touchStart && touchEnd && (() => {
              const currentIndex = tabOrder.indexOf(activeTab);
              const distanceX = touchStart.x - touchEnd.x;
              let previewTab: string | null = null;
              
              if (distanceX > 0 && currentIndex < tabOrder.length - 1) {
                // Swiping left - show next screen
                previewTab = tabOrder[currentIndex + 1];
              } else if (distanceX < 0 && currentIndex > 0) {
                // Swiping right - show previous screen
                previewTab = tabOrder[currentIndex - 1];
              }

              if (!previewTab) return null;

              return (
                <div 
                  className="absolute inset-0 w-full h-full overflow-y-auto"
                  style={{
                    transform: swipeDirection === 'left' 
                      ? `translateX(${(1 - swipeProgress) * 100}%)` 
                      : `translateX(-${(1 - swipeProgress) * 100}%)`,
                    opacity: swipeProgress * 0.5,
                    transition: 'none',
                    willChange: 'transform, opacity',
                    pointerEvents: 'none',
                  }}
                >
                  {previewTab === "home" && (
                    <HomeScreen
                      onTaskClick={handleTaskClick}
                      onViewTasks={() => {}}
                      onAddTask={() => {}}
                    />
                  )}
                  {previewTab === "tasks" && (
                    <TasksScreen
                      onTaskClick={handleTaskClick}
                      onBack={handleBackToHome}
                    />
                  )}
                  {previewTab === "add" && (
                    <AddTaskScreen
                      onBack={handleBackToHome}
                      onSave={handleAddTaskSave}
                    />
                  )}
                  {previewTab === "team-progress" && (
                    <TeamProgressScreen
                      onBack={handleBackToHome}
                    />
                  )}
                  {previewTab === "profile" && (
                    <ProfileScreen 
                      onLogout={handleLogout} 
                      onViewTeamProgress={() => {
                        setCurrentScreen("team-progress");
                        setActiveTab("team-progress");
                      }}
                    />
                  )}
                </div>
              );
            })()}
          </>
        )}

        {!showBottomNav && (
          <>
            {currentScreen === "task-detail" && selectedTaskId && (
              <TaskDetailScreen
                taskId={selectedTaskId}
                onBack={() => setCurrentScreen("tasks")}
              />
            )}
            {currentScreen === "team-progress" && (
              <TeamProgressScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}
          </>
        )}
      </div>

      {showBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      <InstallPrompt />
    </div>
  );
}