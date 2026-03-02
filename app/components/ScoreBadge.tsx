import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const config =
    score > 69
      ? { bg: "bg-green-100", text: "text-green-700", label: "Strong" }
      : score > 49
      ? { bg: "bg-amber-100", text: "text-amber-700", label: "Good Start" }
      : { bg: "bg-red-100", text: "text-red-600", label: "Needs Work" };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default ScoreBadge;
