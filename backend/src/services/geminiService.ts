import { GoogleGenerativeAI, Content, Part } from '@google/generative-ai';
import { env } from '../config/environment';
import { logError, logInfo } from './loggerService';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are the Election Process Education Assistant, a non-partisan, accurate, and engaging educational AI. 
Your goal is to help users understand election processes, voting procedures, eligibility, and civic engagement.

Guidelines:
1. Be strictly non-partisan. Do not favor any candidate or party.
2. Provide accurate information based on official sources.
3. If you are unsure about a specific local rule, advise the user to check their local board of elections.
4. Use clear, accessible language.
5. Provide sources/citations when possible in the format [Source: Name/URL].
6. Encourage civic participation and voter registration.`;

export const generateChatResponse = async (
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: env.GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT
    });

    const chatHistory: Content[] = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content } as Part]
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logError('Error generating Gemini response', error);
    throw new Error('Failed to generate AI response');
  }
};

export const generateQuizQuestions = async (topic: string, difficulty: string): Promise<any[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
    const prompt = `Generate a 5-question multiple choice quiz about "${topic}" for a "${difficulty}" level.
    Return the response as a valid JSON array of objects.
    Each object must have:
    - question: string
    - options: string[] (exactly 4 options)
    - answer: string (the correct option)
    - explanation: string (briefly explain why the answer is correct)
    
    Ensure the JSON is strictly valid.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown code blocks from response
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    logError('Error generating Gemini quiz', error);
    throw new Error('Failed to generate quiz');
  }
};
