import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/environment';
import { ELECTION_EDUCATION_SYSTEM_PROMPT } from '../constants/prompts';
import { logger } from '../middleware/logger';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export interface MessageContext {
  role: 'user' | 'assistant';
  content: string;
}

export const generateChatResponse = async (
  message: string,
  history: MessageContext[] = []
) => {
  try {
    const messages = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    messages.push({ role: 'user', content: message });

    // Keep only last 20 messages for context
    const limitedMessages = messages.slice(-20);

    const response = await anthropic.messages.create({
      model: env.CLAUDE_MODEL,
      max_tokens: env.CLAUDE_MAX_TOKENS,
      temperature: env.CLAUDE_TEMPERATURE,
      system: ELECTION_EDUCATION_SYSTEM_PROMPT,
      messages: limitedMessages as Anthropic.MessageParam[],
    });

    const block = response.content[0];
    let responseText = '';
    
    if (block.type === 'text') {
      responseText = block.text;
    }

    return responseText;
  } catch (error) {
    logger.error('Claude API Error:', error);
    throw new Error('Failed to generate response from AI service');
  }
};

export const generateQuizQuestions = async (
  topic: string,
  difficulty: string,
  count: number
) => {
  try {
    const prompt = `Generate a ${difficulty} level quiz about "${topic}" with ${count} multiple choice questions.
    Return ONLY a JSON array of objects with the following structure:
    [
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0, // index of the correct option
        "explanation": "Explanation of why this is the correct answer"
      }
    ]
    Do not include any markdown formatting, backticks, or text outside the JSON array.`;

    const response = await anthropic.messages.create({
      model: env.CLAUDE_MODEL,
      max_tokens: env.CLAUDE_MAX_TOKENS,
      temperature: 0.3,
      system: ELECTION_EDUCATION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = response.content[0];
    let responseText = '';
    
    if (block.type === 'text') {
      responseText = block.text;
    }

    // Try to parse the JSON
    try {
      const parsed = JSON.parse(responseText.trim());
      return parsed;
    } catch (parseError) {
      logger.error('Failed to parse quiz JSON:', responseText);
      // Fallback parser if Claude wrapped it in markdown
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('Invalid JSON format returned from AI');
    }
  } catch (error) {
    logger.error('Claude Quiz Generation Error:', error);
    throw new Error('Failed to generate quiz');
  }
};
