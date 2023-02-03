import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";

dotenv.config();

let app: Express = express();
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
app.listen(7777, () => {
  connect();
  console.log("Server started on port 7777");
});
app.get("/", (req: Request, res: Response) => {
  //console.log(req);
  res.send("Hello World!");
});
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
