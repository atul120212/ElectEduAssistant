import { render, screen, fireEvent } from '@testing-library/react';
import { QuizInterface } from './QuizInterface';
import { useQuizStore } from '../../store/quizStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../store/quizStore', () => ({
  useQuizStore: vi.fn(),
}));

describe('QuizInterface', () => {
  const mockGenerateQuiz = vi.fn();
  const mockAnswerQuestion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state with setup form', () => {
    (useQuizStore as any).mockReturnValue({
      quizId: null,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isGenerating: false,
      generateQuiz: mockGenerateQuiz,
    });

    render(<QuizInterface />);
    expect(screen.getByText('Test Your Knowledge')).toBeDefined();
    expect(screen.getByText('Generate Quiz')).toBeDefined();
  });

  it('renders questions when quiz is active', () => {
    (useQuizStore as any).mockReturnValue({
      quizId: '123',
      questions: [{ 
        question: 'Who can vote?', 
        options: ['Adults', 'Children'], 
        answer: 'Adults' 
      }],
      currentQuestionIndex: 0,
      userAnswers: [],
      isGenerating: false,
      answerQuestion: mockAnswerQuestion,
    });

    render(<QuizInterface />);
    expect(screen.getByText('Who can vote?')).toBeDefined();
    expect(screen.getByText('Adults')).toBeDefined();
  });

  it('renders results when quiz is finished', () => {
    (useQuizStore as any).mockReturnValue({
      results: {
        score: 80,
        correctAnswers: 4,
        totalQuestions: 5,
        feedback: []
      },
      isGenerating: false,
      resetQuiz: vi.fn()
    });

    render(<QuizInterface />);
    expect(screen.getByText('Quiz Results')).toBeDefined();
    expect(screen.getByText('80%')).toBeDefined();
  });
});
