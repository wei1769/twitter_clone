import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import { handleError } from "./error";
import cors from "cors";
import tweetRoutes from "./routes/tweet";
dotenv.config();

let app: Express = express();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/tweets", tweetRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  return;
});
app.use(handleError);
app.listen(7777, () => {
  connect();
  console.log("Server started on port 7777");
});

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MongoUrl as string)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      throw err;
    });
};
