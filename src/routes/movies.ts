import express, {Request, Response} from 'express';
import jwtAuth from '../middleware/basicAuth';

const router = express.Router();

router.get('/user', jwtAuth, (req: Request, res: Response) => {
  res.json({ message: 'This is a user route', userId: req.userId, role: req.role });
});

// Admin-only route
router.get('/admin', jwtAuth, (req: Request, res: Response):void => {
  if (req.role !== 'admin') {
    res.status(403).json({ message: 'Access forbidden: Admins only' });
    return;
  }
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
