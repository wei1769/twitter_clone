import { serverError } from "../error";
import Tweet from "../models/Tweet";
import User, {
  filterFetchData,
  filterUpdateData,
  userInterface,
} from "../models/User";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = (await User.findById(req.params.id)) as userInterface;
    let resData = filterFetchData(users._doc);
    res.status(200).json(resData);
  } catch (err) {
    return next(new serverError(404, "User not found"));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: filterUpdateData(req.body),
      },
      {
        new: true,
      }
    );
    res.status(200).json(filterUpdateData(updatedUser));
  } catch (err) {
    return next(new serverError(500, "Error updating user"));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    await Tweet.remove({ userId: req.body.userId });
    res.status(200).json("User delete");
  } catch (err) {
    return next(new serverError(500, "Error deleting user"));
  }
};

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) return next(new serverError(404, "User not found"));
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser?.following.includes(userToFollow?._id)) {
      await currentUser?.updateOne({ $push: { following: req.params.id } });
      if (!userToFollow?.followers.includes(currentUser?._id)) {
        await userToFollow?.updateOne({
          $push: { followers: req.body.userId },
        });
      }
    } else {
      return next(new serverError(403, "you already follow this user"));
    }
    res.status(200).json("User followed");
  } catch (err) {
    return next(new serverError(500, "Error following user"));
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) return next(new serverError(404, "User not found"));
    const currentUser = await User.findById(req.body.userId);
    if (currentUser?.following.includes(userToUnfollow?._id)) {
      await currentUser?.updateOne({ $pull: { following: req.params.id } });
      if (userToUnfollow?.followers.includes(currentUser?._id)) {
        await userToUnfollow?.updateOne({
          $pull: { followers: req.body.userId },
        });
      }
    } else {
      return next(new serverError(403, "you are not following this user"));
    }
    res.status(200).json("User unfollowed");
  } catch (err) {
    return next(new serverError(500, "Error unfollowing user"));
  }
};
