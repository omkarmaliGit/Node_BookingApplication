import express, {Request, Response} from 'express';
import jwtAuth from '../middleware/basicAuth';
import adminAuth from '../middleware/roleAuth';

const router = express.Router();

router.get('/user', jwtAuth, (req: Request, res: Response) => {
  res.json({ message: 'This is a user route', userId: req.userId, role: req.role });
});

// Admin-only route
router.get('/admin', jwtAuth, adminAuth, (req: Request, res: Response) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
