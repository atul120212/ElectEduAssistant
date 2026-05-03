import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getTimeline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.params;
    const { state, year } = req.query;

    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    const events = await prisma.timelineEvent.findMany({
      where: {
        country,
        ...(state ? { state: state as string } : {}),
        eventDate: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        }
      },
      orderBy: { eventDate: 'asc' }
    });

    const upcomingDeadlines = events.filter(e => new Date(e.eventDate) > new Date());

    res.status(200).json({
      status: 'success',
      data: { events, upcomingDeadlines }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReminders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      data: { reminders }
    });
  } catch (error) {
    next(error);
  }
};

export const createReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { eventId, notifyBefore } = req.body;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        eventId,
        notifyBefore,
      },
      include: { event: true }
    });

    res.status(201).json({
      status: 'success',
      data: { reminder }
    });
  } catch (error) {
    next(error);
  }
};
