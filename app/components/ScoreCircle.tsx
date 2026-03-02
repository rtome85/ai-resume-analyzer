const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const radius = 34;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <div className="relative w-[76px] h-[76px] flex-shrink-0">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 76 76"
        className="-rotate-90"
      >
        <defs>
          <linearGradient id="circleGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="38"
          cy="38"
          r={normalizedRadius}
          stroke="#e2e8f0"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx="38"
          cy="38"
          r={normalizedRadius}
          stroke="url(#circleGrad)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-sm text-slate-900 leading-none">{score}</span>
        <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">/100</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
