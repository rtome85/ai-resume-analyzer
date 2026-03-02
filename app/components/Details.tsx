import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const InlineScoreBadge = ({ score }: { score: number }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
      score > 69
        ? "bg-green-100 text-green-700"
        : score > 39
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-600"
    )}
  >
    <img
      src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
      alt=""
      className="w-3 h-3"
    />
    {score}/100
  </span>
);

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => (
  <div className="flex items-center gap-2.5">
    <span className="text-sm font-semibold text-slate-800">{title}</span>
    <InlineScoreBadge score={categoryScore} />
  </div>
);

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => (
  <div className="flex flex-col gap-3">
    {tips.map((tip, index) => (
      <div
        key={index + tip.tip}
        className={cn(
          "flex flex-col gap-1.5 rounded-xl p-4 border",
          tip.type === "good"
            ? "bg-green-50 border-green-100"
            : "bg-amber-50 border-amber-100"
        )}
      >
        <div className="flex items-center gap-2">
          <img
            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
            alt={tip.type}
            className="w-4 h-4 flex-shrink-0"
          />
          <p
            className={cn(
              "text-sm font-semibold",
              tip.type === "good" ? "text-green-800" : "text-amber-800"
            )}
          >
            {tip.tip}
          </p>
        </div>
        <p
          className={cn(
            "text-xs leading-relaxed pl-6",
            tip.type === "good" ? "text-green-700/80" : "text-amber-700/80"
          )}
        >
          {tip.explanation}
        </p>
      </div>
    ))}
  </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="feedback-card">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Detailed Analysis
      </p>
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
