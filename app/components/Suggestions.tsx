import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const SuggestionCard = ({
  section,
  tip,
  suggestion,
  example,
}: {
  section: string;
  tip: string;
  suggestion: string;
  example: string;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl p-5 bg-brand-50/60 border border-brand-100">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <img src="/icons/pin.svg" alt="" className="w-4 h-4 opacity-60 flex-shrink-0" />
        <span className="text-sm font-bold text-brand-800">{section}</span>
      </div>

      {/* Tip */}
      <div className="flex gap-3 items-start">
        <img src="/icons/info.svg" alt="" className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
        <div>
          <p className="text-xs font-semibold text-brand-700 mb-1">Tip</p>
          <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
        </div>
      </div>

      {/* What to change */}
      <div className="flex gap-3 items-start">
        <img src="/icons/warning.svg" alt="" className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-amber-700 mb-1">What to Change</p>
          <p className="text-sm text-slate-600 leading-relaxed">{suggestion}</p>
        </div>
      </div>

      {/* Example */}
      <div className="flex gap-3 items-start">
        <img src="/icons/check.svg" alt="" className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-green-700 mb-1">Example</p>
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-sm text-slate-700 italic leading-relaxed">{example}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Suggestions = ({ feedback }: { feedback: Feedback }) => {
  if (!feedback.suggestions?.tips || feedback.suggestions.tips.length === 0) {
    return (
      <div className="feedback-card">
        <div className="flex items-center gap-3 mb-4">
          <img src="/icons/ats-good.svg" alt="" className="w-7 h-7" />
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              Resume Suggestions
            </h3>
            <p className="text-xs text-slate-500">Tailored to your target role</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
          <img src="/icons/check.svg" alt="" className="w-8 h-8 opacity-25" />
          <p className="text-sm font-medium text-slate-500">No suggestions needed</p>
          <p className="text-xs text-slate-400">Your resume is well-aligned for this role</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-card">
      <Accordion>
        <AccordionItem id="suggestions">
          <AccordionHeader itemId="suggestions">
            <div className="flex items-center gap-2.5">
              <img src="/icons/ats-good.svg" alt="" className="w-6 h-6" />
              <span className="text-sm font-semibold text-slate-800">
                Resume Suggestions
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {feedback.suggestions.tips.length}
              </span>
            </div>
          </AccordionHeader>
          <AccordionContent itemId="suggestions">
            <div className="flex flex-col gap-4 pt-2">
              {feedback.suggestions.tips.map((suggestion, index) => (
                <SuggestionCard
                  key={`${suggestion.section}-${index}`}
                  section={suggestion.section}
                  tip={suggestion.tip}
                  suggestion={suggestion.suggestion}
                  example={suggestion.example}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Suggestions;
