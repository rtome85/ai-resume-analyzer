import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const scoreColor =
    score > 69 ? "#16a34a" : score > 49 ? "#d97706" : "#e11d48";

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative w-28 h-14">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
          <span className="text-xl font-bold text-slate-900 leading-none">
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
            /100
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
