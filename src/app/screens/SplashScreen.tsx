import { TrineoIcon } from "../components/trineo/TrineoIcon";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // Auto-advance after 2 seconds
  setTimeout(() => {
    onComplete();
  }, 2000);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <TrineoIcon className="w-24 h-24" />
        <div className="text-center">
          <h1 className="text-white mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            Trineo Tasks
          </h1>
          <p className="text-white/90 text-sm" style={{ fontWeight: 400 }}>
            Where Innovation Meets Action
          </p>
        </div>
      </div>
    </div>
  );
}
