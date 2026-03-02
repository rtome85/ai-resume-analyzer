import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle"
import { useEffect, useState } from "react"
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
  const [resumeUrl, setResumeUrl] = useState('');
  const { fs } = usePuterStore();

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      setResumeUrl(URL.createObjectURL(blob));
    };
    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-700 group"
    >
      {/* Header */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {companyName && (
            <p className="font-semibold text-slate-900 text-base truncate leading-tight">
              {companyName}
            </p>
          )}
          {jobTitle && (
            <p className="text-sm text-slate-500 truncate">{jobTitle}</p>
          )}
          {!companyName && !jobTitle && (
            <p className="font-semibold text-slate-900">Resume</p>
          )}
        </div>
        <ScoreCircle score={feedback.overallScore} />
      </div>

      {/* Preview */}
      {resumeUrl ? (
        <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img
            src={resumeUrl}
            alt="Resume preview"
            className="w-full h-[280px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 h-[280px] flex items-center justify-center">
          <div
            className="w-7 h-7 rounded-full border-2 border-brand-300 border-t-transparent animate-spin"
          />
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
