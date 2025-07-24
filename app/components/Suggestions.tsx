import { cn } from "~/lib/utils";
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
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-blue-50 border border-blue-200">
      {/* Section Header */}
      <div className="flex flex-row gap-2 items-center">
        <img src="/icons/pin.svg" alt="section" className="size-5" />
        <h3 className="text-xl font-semibold text-blue-800">{section}</h3>
      </div>

      {/* Tip */}
      <div className="flex flex-row gap-3 items-start">
        <img src="/icons/info.svg" alt="tip" className="size-5 mt-1 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium text-blue-700">Tip</p>
          <p className="text-gray-700">{tip}</p>
        </div>
      </div>

      {/* Suggestion */}
      <div className="flex flex-row gap-3 items-start">
        <img src="/icons/warning.svg" alt="suggestion" className="size-5 mt-1 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium text-orange-700">What to Change</p>
          <p className="text-gray-700">{suggestion}</p>
        </div>
      </div>

      {/* Example */}
      <div className="flex flex-row gap-3 items-start">
        <img src="/icons/check.svg" alt="example" className="size-5 mt-1 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium text-green-700">Example</p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 italic">{example}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuggestionsHeader = () => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <img src="/icons/ats-good.svg" alt="suggestions" className="size-8" />
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">Resume Suggestions</h2>
        <p className="text-gray-600">Improve your resume based on the job requirements</p>
      </div>
    </div>
  );
};

const Suggestions = ({ feedback }: { feedback: Feedback}) => {
  if (!feedback.suggestions?.tips || feedback.suggestions.tips.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <SuggestionsHeader />
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <img src="/icons/check.svg" alt="no suggestions" className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 text-lg">No specific suggestions available at this time.</p>
          <p className="text-gray-400">Your resume looks good for this position!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <SuggestionsHeader />
      
      <Accordion>
        <AccordionItem id="suggestions">
          <AccordionHeader itemId="suggestions">
            <div className="flex flex-row gap-4 items-center py-2">
              <p className="text-xl font-semibold">
                {feedback.suggestions.tips.length} Improvement Suggestion{feedback.suggestions.tips.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px] bg-blue-100">
                <img src="/icons/info.svg" alt="suggestions" className="size-4" />
                <p className="text-sm font-medium text-blue-700">
                  {feedback.suggestions.tips.length}
                </p>
              </div>
            </div>
          </AccordionHeader>
          <AccordionContent itemId="suggestions">
            <div className="flex flex-col gap-6 w-full">
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
