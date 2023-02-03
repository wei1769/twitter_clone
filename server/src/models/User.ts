import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    followers: { type: Array, defaultValue: [] },
    following: { type: Array, defaultValue: [] },
    description: { type: String },
  },
  { timestamps: true }
);
export interface userInterface extends mongoose.Document {
  _doc: { [x: string]: any; password: any; };
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  description: string;
}

export default mongoose.model<userInterface>("User", UserSchema);
