import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from 'react'
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage, pdf2json } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { AIResponseFormat } from "~/constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: {
    companyName: string, jobTitle: string, jobDescription: string, file: File
  }) => {
    setIsProcessing(true);
    setStatusText('Uploading the file...');

    try {
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error('Failed to upload file');

      const result = await pdf2json(file);
      if (result.error) throw new Error(`PDF conversion failed: ${result.error}`);

      const resumeContent = result.text ?? '';

      setStatusText('Converting to image...');
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) throw new Error('Failed to convert PDF to image');

      setStatusText('Uploading the image...');
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) throw new Error('Failed to upload image');

      setStatusText('Preparing data...');

      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName, jobTitle, jobDescription,
        feedback: {}
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText('Analyzing...');

      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, jobDescription, resumeContent, AIResponseFormat }),
      });
      if (!res.ok) throw new Error('Failed to analyze resume');
      const { feedback } = await res.json();
      if (!feedback) throw new Error('Failed to analyze resume');

      data.feedback = feedback;

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analysis complete, redirecting...');

      navigate(`/resume/${uuid}`);
    } catch (error) {
      console.error('Analysis error:', error);
      setStatusText(error instanceof Error ? `Error: ${error.message}` : 'An unexpected error occurred');
      setIsProcessing(false);
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file })
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section pt-12">
        {/* Heading */}
        <div className="page-heading">
          <h1>Smart feedback for<br />your dream job</h1>
          {!isProcessing && (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
        </div>

        {/* Processing state */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-5 py-4 animate-in fade-in duration-500 w-full max-w-sm">
            <div className="feedback-card w-full text-center">
              <img
                src="/images/resume-scan.gif"
                className="w-40 mx-auto mb-4 rounded-xl"
                alt="Analyzing..."
              />
              <p className="text-slate-600 font-medium text-sm">{statusText}</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Upload form */}
        {!isProcessing && (
          <div className="w-full max-w-2xl">
            <div className="feedback-card">
              <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                    <input
                      type="text"
                      name="company-name"
                      placeholder="e.g. Google"
                      id="company-name"
                    />
                  </div>
                  <div className="form-div">
                    <label htmlFor="job-title">Job Title</label>
                    <input
                      type="text"
                      name="job-title"
                      placeholder="e.g. Senior Engineer"
                      id="job-title"
                    />
                  </div>
                </div>

                <div className="form-div">
                  <label htmlFor="job-description">Job Description</label>
                  <textarea
                    rows={8}
                    name="job-description"
                    placeholder="Paste the full job description here..."
                    id="job-description"
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="uploader">Resume (PDF)</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>

                <button className="primary-button mt-1" type="submit">
                  Analyze Resume
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Upload
