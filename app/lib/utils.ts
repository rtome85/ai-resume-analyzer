import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponseFormat } from "~/constants";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    // Determine the appropriate unit by calculating the log
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Format with 2 decimal places and round
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

export function parseMarkdownToJson(markdownText: string): unknown | null {
    const regex = /```json\n([\s\S]+?)\n```/;
    const match = markdownText.match(regex);

    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }
    console.error("No valid JSON found in markdown text.");
    return null;
}





export const geminiFeedback = async ({jobTitle, jobDescription, resumeContent, AIResponseFormat}: 
    { jobTitle: string, jobDescription: string, resumeContent: string, AIResponseFormat: string }) => {

        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

        try {
          const prompt =     `You are an expert in ATS (Applicant Tracking System) and resume analysis.
          Please analyze and rate this resume and suggest how to improve it.
          The resume full data: ${resumeContent}
          The rating can be low if the resume is bad.
          Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
          If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
          If available, use the job description for the job user is applying to to give more detailed feedback.
          If provided, take the job description into consideration.
          The job title is: ${jobTitle}
          The job description is: ${jobDescription}
          Provide the feedback using the following format: ${AIResponseFormat}
          Return the analysis as a JSON object, without any other text and without the backticks.
          Do not include any other text or comments.`;

          const textResult = await genAI
          .getGenerativeModel({ model: "gemini-2.0-flash"})
          .generateContent([prompt]);

          const response = parseMarkdownToJson(textResult.response.text());

          return response;
        }
        catch (error) {
          console.error('Error generating feedback with Gemini: ', error);
          return null;
        }
      };


