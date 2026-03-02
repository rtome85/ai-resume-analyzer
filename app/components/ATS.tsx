import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const isGood = score > 69;
  const isOk = score > 49;

  const config = isGood
    ? {
        border: "border-green-200",
        icon: "/icons/ats-good.svg",
        labelColor: "text-green-700",
        label: "Great ATS Score",
        barColor: "bg-green-500",
        barBg: "bg-green-100",
      }
    : isOk
    ? {
        border: "border-amber-200",
        icon: "/icons/ats-warning.svg",
        labelColor: "text-amber-700",
        label: "Decent ATS Score",
        barColor: "bg-amber-400",
        barBg: "bg-amber-100",
      }
    : {
        border: "border-red-200",
        icon: "/icons/ats-bad.svg",
        labelColor: "text-red-600",
        label: "Needs Improvement",
        barColor: "bg-red-500",
        barBg: "bg-red-100",
      };

  return (
    <div className={`feedback-card border ${config.border}`}>
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-4">
        <img src={config.icon} alt="ATS" className="w-9 h-9 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              ATS Compatibility
            </h3>
            <span className={`text-sm font-bold tabular-nums ${config.labelColor}`}>
              {score}/100
            </span>
          </div>
          <p className={`text-sm font-medium mt-0.5 ${config.labelColor}`}>
            {config.label}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`h-1.5 ${config.barBg} rounded-full overflow-hidden mb-5`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Tips */}
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type}
                className="w-4 h-4 mt-0.5 flex-shrink-0"
              />
              <p
                className={`text-sm leading-relaxed ${
                  suggestion.type === "good" ? "text-green-700" : "text-amber-700"
                }`}
              >
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 italic mt-4 pt-4 border-t border-slate-100">
        Keep refining your resume to improve your chances of passing ATS filters.
      </p>
    </div>
  );
};

export default ATS;
