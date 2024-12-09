import express, {Request, Response} from 'express';
import jwtAuth from '../middleware/basicAuth';
import adminAuth from '../middleware/roleAuth';

const router = express.Router();

// Admin-only route
router.get('/admin', jwtAuth, adminAuth, (req: Request, res: Response) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
