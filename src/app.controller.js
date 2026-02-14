import express from "express";
import checkConnectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
const app = express();
const port = 3000;

const bootstrap = () => {
  app.use(express.json());

  checkConnectionDB();

  app.get("/", (req, res) => {
    res.status(200).json({ message: `Welcome on Saraha App 😍🤩` });
  });

  app.use("/users" , userRouter)

  app.use("{/*notFound}", (req, res) => {
    throw new Error(`URL ${req.originalUrl} not found ❎`, { cause: 404 });
  });
  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;
