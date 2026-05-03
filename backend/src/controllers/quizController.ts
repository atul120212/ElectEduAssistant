import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { generateQuizQuestions } from '../services/claudeService';
import { AppError } from '../middleware/errorHandler';

export const generateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic, difficulty, count } = req.body;

    const questions = await generateQuizQuestions(topic, difficulty, count);

    const quiz = await prisma.quiz.create({
      data: {
        topic,
        difficulty,
        questions: questions,
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        quizId: quiz.id,
        questions: questions.map((q: any) => ({
          question: q.question,
          options: q.options,
          // Exclude correct answer for client
        })),
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User must be logged in to submit quiz', 401);
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    const questions: any = quiz.questions;
    let correctAnswers = 0;
    const feedback: any[] = [];

    answers.forEach((ans: any, index: number) => {
      const isCorrect = ans.selectedOption === questions[index].correctAnswer;
      if (isCorrect) correctAnswers++;

      feedback.push({
        questionId: index,
        isCorrect,
        correctOption: questions[index].correctAnswer,
        explanation: questions[index].explanation
      });
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const result = await prisma.quizResult.create({
      data: {
        quizId,
        userId,
        answers,
        score,
        totalQuestions,
        timeSpent
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        score,
        correctAnswers,
        totalQuestions,
        feedback,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const history = await prisma.quizResult.findMany({
      where: { userId },
      include: {
        quiz: {
          select: { topic: true, difficulty: true }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      data: { history }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const results = await prisma.quizResult.findFirst({
      where: { quizId, userId },
      include: { quiz: true }
    });

    if (!results) {
      throw new AppError('Results not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { results }
    });
  } catch (error) {
    next(error);
  }
};
