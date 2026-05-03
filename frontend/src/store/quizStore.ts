import { create } from 'zustand';
import api from '../services/api';

export interface Question {
  question: string;
  options: string[];
}

interface QuizState {
  quizId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: { questionIndex: number; selectedOption: number }[];
  isGenerating: boolean;
  isSubmitting: boolean;
  results: any | null;
  error: string | null;
  
  generateQuiz: (topic: string, difficulty: string, count: number) => Promise<void>;
  answerQuestion: (index: number, option: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizId: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isGenerating: false,
  isSubmitting: false,
  results: null,
  error: null,

  generateQuiz: async (topic, difficulty, count) => {
    set({ isGenerating: true, error: null, results: null, currentQuestionIndex: 0, userAnswers: [] });
    try {
      const response = await api.post('/quiz/generate', { topic, difficulty, count });
      set({ 
        quizId: response.data.data.quizId,
        questions: response.data.data.questions,
        isGenerating: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to generate quiz',
        isGenerating: false 
      });
    }
  },

  answerQuestion: (index, option) => {
    set((state) => {
      const newAnswers = [...state.userAnswers];
      const existingAnswerIndex = newAnswers.findIndex(a => a.questionIndex === index);
      
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex].selectedOption = option;
      } else {
        newAnswers.push({ questionIndex: index, selectedOption: option });
      }
      
      return { userAnswers: newAnswers };
    });
  },

  nextQuestion: () => set((state) => ({ 
    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1) 
  })),

  prevQuestion: () => set((state) => ({ 
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0) 
  })),

  submitQuiz: async () => {
    const { quizId, userAnswers } = get();
    if (!quizId) return;

    set({ isSubmitting: true, error: null });
    try {
      // Sort answers by index to match questions
      const sortedAnswers = [...userAnswers].sort((a, b) => a.questionIndex - b.questionIndex);
      
      const response = await api.post('/quiz/submit', { 
        quizId, 
        answers: sortedAnswers 
      });
      
      set({ 
        results: response.data.data,
        isSubmitting: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to submit quiz',
        isSubmitting: false 
      });
    }
  },

  resetQuiz: () => set({
    quizId: null,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    results: null,
    error: null,
  })
}));
