import { resumes } from "~/constants";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Tailor your resume to the job you want" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
      if(!auth.isAuthenticated) navigate('/auth?/next=/');

  }, [auth.isAuthenticated])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your applications & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>
        {resumes.length >0 && 
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard 
                key={resume.id}
                resume={resume}
              />
            ))}
          </div>}
      </section>

    </main>
  );
}
