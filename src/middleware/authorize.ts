import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authorize = (excludedPaths: IAuth[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        excludedPaths.some(
          (ep) => ep.method === req.method && req.url.startsWith(ep.path)
        )
      ) {
        return next();
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization token is missing" });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      const JWT_SECRET =
        (process.env.JWT_SECRET as string) ||
        "70728c6235fe0363683b8e1093f39ee5dca1594712e3e5d3bf67f429539abfce";

      if (token && JWT_SECRET) {
        const payload = jwt.verify(token, JWT_SECRET);
        res.locals["userData"] = payload;
        next();
      } else {
        throw { message: "AUTHORIZE.UNAUTHORIZE_TOKEN" };
      }
    } catch (e) {
      next(e);
    }
  };
};

export interface IAuth {
  path: string;
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
}

export default authorize;
