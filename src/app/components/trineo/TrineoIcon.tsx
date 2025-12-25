export function TrineoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Geometric TN icon inspired by Trineo brand */}
        <path
          d="M12 16L12 48L20 48L20 24L30 24L30 48L38 48L38 16L12 16Z"
          fill="#1E40AF"
        />
        <path
          d="M42 16L42 48L50 48L50 30L50 16L42 16Z"
          fill="#2563EB"
        />
        <path
          d="M50 30L50 48L58 32L50 30Z"
          fill="#3B82F6"
        />
      </svg>
    </div>
  );
}
