import { Request, Response, NextFunction } from "express";

const permit = (permittedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userData = res.locals["userData"];
    if (!userData.role) {
      return next("ERROR_CODES.UNAUTHORIZED,AUTHORIZE.PERMISSION_NOT_GRANTED");
    }
    const roles = userData.role;
    if (!permittedRoles.some((role) => roles.includes(role))) {
      return next("ERROR_CODES.UNAUTHORIZED, AUTHORIZE.PERMISSION_NOT_GRANTED");
    }
    next();
  };
};

export default permit;
