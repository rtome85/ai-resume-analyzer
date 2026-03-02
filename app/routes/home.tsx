import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router";
import { GuestStorageService, usePuterStore } from "~/lib/puter"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Tailor your resume to the job you want" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map(resume => (
        JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section pt-16">
        {/* Hero heading */}
        <div className="page-heading">
          <h1>Your Resume Dashboard</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>Upload your first resume to get AI-powered feedback tailored to the job.</h2>
          ) : (
            <h2>Review your submissions and track AI-powered scores.</h2>
          )}
        </div>

        {/* Loading state */}
        {loadingResumes && (
          <div className="flex flex-col items-center gap-3 py-20">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading resumes"
              className="w-[140px] opacity-75"
            />
            <p className="text-sm text-slate-400 font-medium">
              Loading your resumes...
            </p>
          </div>
        )}

        {/* Resume grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center gap-5 py-10">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-brand-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700 mb-1">No resumes yet</p>
              <p className="text-sm text-slate-400">
                Upload your first resume to get started
              </p>
            </div>
            <Link to="/upload" className="primary-button w-auto mt-1">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
