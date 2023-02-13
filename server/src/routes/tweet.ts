import express from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getExploreTweets,
  getUserTweets,
  likeOrDislike,
} from "../controllers/tweet";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/", verifyToken, createTweet);
// Delete a Tweet
router.delete("/:id", verifyToken, deleteTweet);

// Like or Dislike a Tweet
router.put("/like/:id", verifyToken, likeOrDislike);

// get all timeline tweets
router.get("/timeline/", verifyToken, getAllTweets);

// get user Tweets only
router.get("/user/all/:id", getUserTweets);

//explore
router.get("/explore", getExploreTweets);
export default router;
