import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  sessionId: z.string().min(1),
  displayName: z.string().optional(),
  location: z.string().optional(),
  language: z.string().default('en'),
  preferences: z.record(z.unknown()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updatePreferencesSchema = z.object({
  displayName: z.string().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
  preferences: z.record(z.unknown()).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
  country: z.string().optional(),
});

export const quizGenerateSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  count: z.number().min(1).max(20).default(5),
});

export const quizSubmitSchema = z.object({
  quizId: z.string().uuid(),
  answers: z.array(z.record(z.unknown())),
  timeSpent: z.number().optional(),
});
