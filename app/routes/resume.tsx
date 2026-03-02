import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Suggestions from "~/components/Suggestions";

export const meta = () => ([
  { title: 'Resumind | Review' },
  { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [isLoading])

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
      setResumeUrl(URL.createObjectURL(pdfBlob));

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      setImageUrl(URL.createObjectURL(imageBlob));

      setFeedback(data.feedback);
    }

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0 min-h-screen bg-slate-50">
      {/* Top nav */}
      <nav className="resume-nav sticky top-0 z-50">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="" className="w-3 h-3 opacity-50" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-sm font-semibold text-slate-900 hidden sm:block">
          Resume Review
        </span>

        {/* Spacer to keep title centered */}
        <div className="w-32 hidden sm:block" />
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* ── PDF Viewer Panel ── */}
        <section
          className="w-1/2 max-lg:w-full bg-slate-100/60 border-r border-slate-200
            lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)]
            flex items-center justify-center p-6 lg:p-8"
        >
          {imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-700 w-full max-w-md">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow duration-200">
                  <img
                    src={imageUrl}
                    className="w-full h-auto object-contain"
                    title="View full PDF"
                    alt="Resume preview"
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                  Click to open full PDF ↗
                </p>
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <img
                src="/images/resume-scan-2.gif"
                className="w-32 opacity-60"
                alt="Loading..."
              />
              <p className="text-sm text-slate-400">Loading resume...</p>
            </div>
          )}
        </section>

        {/* ── Feedback Panel ── */}
        <section className="w-1/2 max-lg:w-full px-6 lg:px-10 py-8 flex flex-col gap-6">
          <div>
            <h2 className="!text-2xl font-bold text-slate-900 !text-slate-900">
              Resume Review
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              AI-powered analysis tailored to your target role
            </p>
          </div>

          {feedback ? (
            <div className="flex flex-col gap-5 animate-in fade-in duration-700">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
              <Suggestions feedback={feedback} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-20">
              <img
                src="/images/resume-scan-2.gif"
                className="w-32 opacity-60"
                alt="Analyzing..."
              />
              <p className="text-sm text-slate-400 font-medium">
                Analyzing your resume...
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Resume
