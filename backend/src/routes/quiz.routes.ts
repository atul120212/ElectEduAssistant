import { Router } from 'express';
import { generateQuiz, submitQuiz, getQuizHistory, getQuizResults, getQuiz } from '../controllers/quizController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { quizGenerateSchema, quizSubmitSchema } from '../utils/validators';

const router = Router();

router.post('/generate', requireAuth, validateRequest(quizGenerateSchema), generateQuiz);
router.post('/submit', requireAuth, validateRequest(quizSubmitSchema), submitQuiz);
router.get('/history/:userId', requireAuth, getQuizHistory);
router.get('/:quizId', requireAuth, getQuiz); // Fixed to use getQuiz
router.get('/:quizId/results', requireAuth, getQuizResults);

export default router;
