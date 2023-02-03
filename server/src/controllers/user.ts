import User, { userInterface } from "../models/User";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = (await User.findById(req.params.id)) as userInterface;
    let { password,email, ...resData } = users;
    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};
