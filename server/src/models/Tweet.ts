import mongoose from "mongoose";
const TweetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      defaultValue: [],
    },
    timestamp: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);
export interface tweetInterface extends mongoose.Document {
  _doc: any;
  userId: string;
  description: string;
  likes: string[];
}
export default mongoose.model<tweetInterface>("Tweet", TweetSchema);
export function filterCreateTweetData(data: any) {
  let timestamp = Math.floor(new Date().getTime() / 1000);
  let { userId, description } = data;
  return { userId, description, timestamp };
}
export function filterFetchingTweetData(data: any) {
  let { userId, description, likes, timestamp } = data;
  return { userId, description, likes, timestamp, id: data._id };
}
