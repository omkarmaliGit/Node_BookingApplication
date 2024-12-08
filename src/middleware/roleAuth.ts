import { Request, Response, NextFunction } from 'express';

// Middleware to check if the user has the admin role
const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.role !== 'admin') {
    res.status(403).json({ message: 'Access forbidden: Admins only' });
    return;
  }
  next(); // Proceed to the next handler
};

export default adminAuth;
