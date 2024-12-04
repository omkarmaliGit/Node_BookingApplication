import { Request, Response, NextFunction } from 'express';
import { readData } from '../helper/fileHelpers';
import bcrypt from 'bcrypt';

const USERS_FILE = "./src/storage/users.json";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

const basicAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [email, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
  const users = readData<{ id: number; email: string; password: string; role: string }[]>(USERS_FILE);

  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  req.userId = user.id;
  req.userRole = user.role; 

  next();
};

// Role-based authorization example
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};

export default basicAuth;
