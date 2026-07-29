import express from "express";
import "../config/config.service.js";
import dbConnection from "./DB/connection/db.connect.js";
import userRouter from "./modules/users/user.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import { redisConnection } from "./common/utils/service/redis/redis.connect.js";
import cors from "cors"
import messageRouter from "./modules/messages/message.controller.js";
const app = express();
const port = process.env.PORT;

const bootstrap = () => {
  app.use(express.json(),cors());

  await redisConnection()
  await dbConnection();

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome on Saraha App 😍🤩" });
  });

  app.use("/auth", authRouter)
  app.use("/users", userRouter)
  app.use("/messages", messageRouter)

  app.use("{/*notFound}", (req, res) => {
    throw new Error(`URL: ${req.originalUrl} not found ❎`, { cause: 404 });
  });

  app.use((err, req, res, next) => {
    return res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });

  app.listen(port, () => {
    console.log(`Server is running on port => ${port} ✅`);
  });
};

export default bootstrap;
