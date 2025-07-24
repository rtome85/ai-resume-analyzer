import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export function meta({}: Route.MetaArgs) {
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

  //checks user authentication
  useEffect(() => {
      if(!auth.isAuthenticated) navigate('/auth?/next=/');

  }, [auth.isAuthenticated])

  //Fetch all resumes from Puter
  useEffect(() => {
    const loadResumes = async() => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      console.log('Resumes: ', resumes)

      const parsedResumes = resumes?.map( resume => (
        JSON.parse(resume.value) as Resume
      ))

      console.log('Parsed Resumes:', parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? 
          (<h2>No resumes found. Upload your first resume to get feedback</h2>)
          : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {/* Loading animation while fetching resume data */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" alt="scan" className="w-[200px]"/>
          </div>
        )}

        {!loadingResumes && resumes.length >0 && 
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard 
                key={resume.id}
                resume={resume}
              />
            ))}
          </div>}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                Upload Resume
              </Link>
            </div>
          )}
      </section>

    </main>
  );
}
