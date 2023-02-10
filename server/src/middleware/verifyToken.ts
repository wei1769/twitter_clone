import jwt, { JwtPayload } from "jsonwebtoken";
import { serverError } from "../error";
import { Request, Response, NextFunction } from "express";
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return next(new serverError(403, "Unauthorized"));
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.body.userId = decoded.id;

    if (decoded.expireTs < new Date().getTime() / 1000)
      return next(new serverError(401, "Login expired"));
    return next();
  } catch (err) {
    // next(new serverError(401, "Unauthorized"));
    next(err);
  }
};
