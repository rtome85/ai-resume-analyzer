import ScoreGauge from "./ScoreGauge"
import ScoreBadge from "./ScoreBadge"

const Category = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="flex items-center justify-between py-3 px-1 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <ScoreBadge score={score} />
      </div>
      <span className="text-sm font-semibold text-slate-900 tabular-nums">
        {score}
        <span className="text-slate-400 font-normal">/100</span>
      </span>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="feedback-card">
      {/* Overall score row */}
      <div className="flex items-center gap-5 mb-6 pb-5 border-b border-slate-100">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Overall Score
          </p>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            Resume Score
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Based on tone, content, structure &amp; skills
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
          Category Breakdown
        </p>
        <Category title="Tone &amp; Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </div>
  );
};

export default Summary;
