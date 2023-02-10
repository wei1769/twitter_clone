import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
export const handleError: ErrorRequestHandler = (
  err: serverError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500);
  res.send(err.message);
};
export class serverError extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
