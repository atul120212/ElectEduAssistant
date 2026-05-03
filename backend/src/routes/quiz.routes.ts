import { Router } from 'express';
import { generateQuiz, submitQuiz, getQuizHistory, getQuizResults } from '../controllers/quizController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { quizGenerateSchema, quizSubmitSchema } from '../utils/validators';

const router = Router();

router.post('/generate', requireAuth, validateRequest(quizGenerateSchema), generateQuiz);
router.post('/submit', requireAuth, validateRequest(quizSubmitSchema), submitQuiz);
router.get('/history/:userId', requireAuth, getQuizHistory);
router.get('/:quizId', requireAuth, getQuizResults); // Fixed route for fetching quiz/results
router.get('/:quizId/results', requireAuth, getQuizResults);

export default router;
