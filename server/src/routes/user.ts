import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../controllers/user";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.get("/find/:id", getUsers);
router.put("/update", verifyToken, updateUser);
router.delete("/delete", verifyToken, deleteUser);
router.put("/follow/:id", verifyToken, followUser);
router.put("/unfollow/:id", verifyToken, unfollowUser);
export default router;
