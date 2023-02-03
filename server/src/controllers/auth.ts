import User, { userInterface } from "../models/User";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({ ...req.body, password: hash }) as userInterface;
    await user.save();
    const { password, ...resData } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(resData);
  } catch (err) {
    next(err);
  }
};
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next({ status: 404, message: "User not found" });
    console.log(user);
    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return next({ status: 400, message: "Wrong password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
    const { password, ...resData } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(resData);
  } catch (err) {
    next(err);
  }
};
