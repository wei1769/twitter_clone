import { serverError } from "../error";
import Tweet, {
  filterCreateTweetData,
  filterFetchingTweetData,
} from "../models/Tweet";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
export const createTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newTweet = new Tweet(filterCreateTweetData(req.body));
  if (newTweet.description.length > 280) {
    return next(new serverError(403, "Tweet is too long"));
  }
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(filterFetchingTweetData(savedTweet));
  } catch (err) {
    return next(new serverError(500, "Error creating tweet"));
  }
};
export const deleteTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return next(new serverError(404, "Tweet not found"));
    console.log(tweet, req.body.userId);
    if (tweet?.userId === req.body.userId) {
      console.log("tweet has been deleted");
      await tweet?.deleteOne();

      res.status(200).json("tweet has been deleted");
    } else {
      return next(new serverError(403, "You can delete only your tweet"));
    }
  } catch (err) {
    return next(new serverError(500, "Error deleting tweet"));
  }
};
export const likeOrDislike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet?.likes.includes(req.body.userId)) {
      await tweet?.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    return next(new serverError(500, "Error liking tweet"));
  }
};

export const getAllTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser) return next(new serverError(404, "User not found"));
    const userTweets = (await Tweet.find({ userId: currentUser?._id })).map(
      (tweet) => {
        return filterFetchingTweetData(tweet);
      }
    );
    const followingTweets = await Promise.all(
      currentUser.following.map((followingId) => {
        return Tweet.find({ userId: followingId });
      })
    );
    res.status(200).json(
      [
        ...userTweets,
        ...followingTweets.flat().map((tweet) => {
          return filterFetchingTweetData(tweet);
        }),
      ].sort((a, b) => b.timestamp - a.timestamp)
    );
  } catch (err) {
    return next(new serverError(500, "Error fetching timeline"));
  }
};

export const getUserTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(await User.findById(req.params.id))) {
    return next(new serverError(404, "User not found"));
  }
  try {
    const userTweets = (await Tweet.find({ userId: req.params.id }))
      .map((tweet) => {
        return filterFetchingTweetData(tweet);
      })
      .sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json(userTweets);
  } catch (err) {
    return next(
      new serverError(500, "Error fetching tweets from " + req.params.id)
    );
  }
};

export const getExploreTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allTweets = (await Tweet.find({ likes: { $exists: true } }))
      .map((tweet) => {
        return filterFetchingTweetData(tweet);
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10000);
    res.status(200).json(allTweets);
  } catch (err) {
    return next(new serverError(500, "Error fetching explore tweets"));
  }
};
