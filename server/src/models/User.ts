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
  { timestamps: true, versionKey: false }
);
export interface userInterface extends mongoose.Document {
  _doc: any;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  description: string;
}

export default mongoose.model<userInterface>("User", UserSchema);
export function filterUpdateData(data: any) {
  let { username, profilePicture, description, email } = data;
  return { username, profilePicture, description, email };
}
export function filterFetchData(data: any) {
  let { username, profilePicture, description, followers, following } = data;
  return {
    username,
    profilePicture,
    description,
    followers,
    following,
    id: data._id,
  };
}
