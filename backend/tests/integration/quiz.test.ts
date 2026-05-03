import request from 'supertest';
import { prisma } from '../../src/config/database';
import { verifyAccessToken } from '../../src/utils/auth';
import express, { Express } from 'express';
import quizRoutes from '../../src/routes/quiz.routes';
import { errorHandler } from '../../src/middleware/errorHandler';

const app: Express = express();
app.use(express.json());
jest.mock('../../src/utils/auth');
app.use((req: any, res, next) => {
  (verifyAccessToken as jest.Mock).mockReturnValue({ userId: 'test-user-id' });
  next();
});
app.use('/api/v1/quiz', quizRoutes);
app.use(errorHandler);

describe('Quiz API Integration Tests', () => {
  beforeAll(async () => {
    await prisma.quizResult.deleteMany();
    await prisma.quiz.deleteMany();
    
    await prisma.quiz.create({
      data: {
        id: 'test-quiz-id',
        topic: 'Voting',
        difficulty: 'medium',
        questions: [
          {
            question: 'What is the voting age?',
            options: ['16', '18', '21'],
            answer: '18'
          }
        ]
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should retrieve a quiz', async () => {
    const res = await request(app)
      .get('/api/v1/quiz/test-quiz-id')
      .set('Authorization', 'Bearer mock-token');
    expect(res.status).toBe(200);
    expect(res.body.data.quiz.topic).toBe('Voting');
  });

  it('should submit quiz results', async () => {
    const res = await request(app)
      .post('/api/v1/quiz/submit')
      .set('Authorization', 'Bearer mock-token')
      .send({
        quizId: 'test-quiz-id',
        answers: ['18'],
        score: 100,
        totalQuestions: 1
      });

    expect(res.status).toBe(201);
    expect(res.body.data.result.score).toBe(100);
  });
});
