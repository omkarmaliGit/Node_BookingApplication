import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import { readData } from '../helper/fileHelpers';

const JWT_SECRET = process.env.JWT_SECRET as string || "70728c6235fe0363683b8e1093f39ee5dca1594712e3e5d3bf67f429539abfce";

// const USERS_FILE = "./src/storage/users.json";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: string;
    }
  }
}

const jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "Authorization token is missing" });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    // Attach user details to the request object
    req.userId = decoded.userId;
    req.role = decoded.role;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
  
};

export default jwtAuth;
