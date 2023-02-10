import User, { userInterface } from "../models/User";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { serverError } from "../error";
dotenv.config();
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
    const token = createToken(user._id);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(resData);
  } catch (err) {
    next(new serverError(409, "Account already exists"));
  }
};
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(new serverError(404, "User not found"));
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) return next(new serverError(400, "Wrong password"));

    const token = createToken(user._id);
    const { password, ...resData } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(resData);
  } catch (err) {
    next(err);
  }
};

function createToken(id: string) {
  let sessionLength = process.env.SessionLength
    ? +process.env.SessionLength
    : 30;
  const token = jwt.sign(
    {
      id: id,
      expireTs: Math.floor(
        new Date().getTime() / 1000 + sessionLength * 24 * 60 * 60
      ),
    },
    process.env.JWT_SECRET as string
  );
  return token;
}
