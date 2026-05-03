import { Router } from 'express';
import { register, login, getProfile, updatePreferences, getAnalytics } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { registerSchema, loginSchema, updatePreferencesSchema } from '../utils/validators';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);

router.get('/profile', requireAuth, getProfile);
router.put('/preferences', requireAuth, validateRequest(updatePreferencesSchema), updatePreferences);
router.get('/analytics', requireAuth, getAnalytics);

export default router;
