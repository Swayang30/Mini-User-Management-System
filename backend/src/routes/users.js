import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Admin routes
router.get('/', authenticate, authorize('admin'), userController.listUsers);
router.patch(
  '/:id/activate',
  authenticate,
  authorize('admin'),
  userController.activateUser
);
router.patch(
  '/:id/deactivate',
  authenticate,
  authorize('admin'),
  userController.deactivateUser
);

// User routes
router.get('/me/profile', authenticate, userController.getProfile);
router.patch('/me', authenticate, userController.updateProfile);
router.patch('/me/password', authenticate, userController.changePassword);

export default router;
