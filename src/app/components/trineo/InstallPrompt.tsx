import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // For iOS, always show manual install instructions
    if (isIOSDevice) {
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('installPromptDismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
      return;
    }

    // For Android/Chrome, listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('installPromptDismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 2000); // Show after 2 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('installPromptDismissed');
    });

    // Fallback: Show prompt after delay if event hasn't fired
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (!dismissed && (isAndroidDevice || isIOSDevice)) {
          setShowPrompt(true);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again (persist across sessions)
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if dismissed
  if (localStorage.getItem('installPromptDismissed') === 'true') {
    return null;
  }

  // Don't show if no prompt and not iOS/Android
  if (!showPrompt && !isIOS && !isAndroid) {
    return null;
  }

  // For iOS, show manual instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-2 pointer-events-none" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="max-w-[360px] mx-auto bg-gradient-to-br from-[#1E40AF] to-[#2563EB] rounded-2xl shadow-2xl p-4 pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm mb-1">Install Trineo Tasks</h3>
              <p className="text-white/90 text-xs mb-2">Tap the share button <span className="font-bold">□↗</span> then "Add to Home Screen"</p>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white touch-manipulation active:scale-95 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For Android/Chrome with prompt event
  if (deferredPrompt && showPrompt) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-2 pointer-events-none" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="max-w-[360px] mx-auto bg-gradient-to-br from-[#1E40AF] to-[#2563EB] rounded-2xl shadow-2xl p-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm mb-1">Install Trineo Tasks</h3>
              <p className="text-white/90 text-xs">Add to home screen for quick access</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-[#1E40AF] px-4 py-2 rounded-xl font-bold text-sm min-h-[44px] touch-manipulation active:scale-95 transition-transform"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white touch-manipulation active:scale-95 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for Android without prompt event
  if (isAndroid && showPrompt && !deferredPrompt) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-2 pointer-events-none" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="max-w-[360px] mx-auto bg-gradient-to-br from-[#1E40AF] to-[#2563EB] rounded-2xl shadow-2xl p-4 pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm mb-1">Install Trineo Tasks</h3>
              <p className="text-white/90 text-xs mb-2">Tap the menu <span className="font-bold">⋮</span> then "Install app" or "Add to Home screen"</p>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white touch-manipulation active:scale-95 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

