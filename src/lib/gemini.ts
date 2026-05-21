import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// Ensure GEMINI_API_KEY is set in your .env.local file
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('GEMINI_API_KEY is missing in environment variables.');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelName: string = 'gemini-2.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};
