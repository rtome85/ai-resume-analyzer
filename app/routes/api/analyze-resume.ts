import { type ActionFunctionArgs } from "react-router";
import { Ollama } from "ollama";
import { parseMarkdownToJson } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { jobTitle, jobDescription, resumeContent, AIResponseFormat } =
    await request.json();

  const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {
      Authorization: "Bearer " + (process.env.OLLAMA_API_KEY || ""),
    },
  });

  const prompt = `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The resume full data: ${resumeContent}
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user improve their resume.
If available, use the job description for the job the user is applying to to give more detailed feedback.
The job title is: ${jobTitle}
The job description is: ${jobDescription}
Provide the feedback using the following format: ${AIResponseFormat}
Return the analysis as a JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;

  const textResult = await ollama.chat({
    model: "gpt-oss:20b-cloud",
    messages: [{ role: "user", content: prompt }],
    stream: false,
  });

  const fullResponse = textResult.message.content;

  let parsed: unknown;
  try {
    parsed = JSON.parse(fullResponse);
  } catch {
    parsed = parseMarkdownToJson(fullResponse);
  }

  return Response.json({ feedback: parsed ?? null });
};
