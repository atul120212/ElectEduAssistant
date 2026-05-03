import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateTokens } from '../utils/auth';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, sessionId, displayName, location, language, preferences } = req.body;

    // Check if user already exists
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        sessionId,
        displayName,
        location,
        language,
        preferences: preferences || {},
      },
    });

    const tokens = generateTokens({ userId: user.id, sessionId: user.sessionId });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          location: user.location,
          language: user.language,
          preferences: user.preferences,
        },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = generateTokens({ userId: user.id, sessionId: user.sessionId });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          location: user.location,
          language: user.language,
          preferences: user.preferences,
        },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            conversations: true,
            quizResults: true,
            bookmarks: true,
            reminders: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          location: user.location,
          language: user.language,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
        statistics: user._count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const updateData = req.body;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          displayName: user.displayName,
          location: user.location,
          language: user.language,
          preferences: user.preferences,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Example analytics aggregation
    const quizResults = await prisma.quizResult.findMany({
      where: { userId },
      include: { quiz: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    res.status(200).json({
      status: 'success',
      data: {
        quizResults,
      },
    });
  } catch (error) {
    next(error);
  }
};
