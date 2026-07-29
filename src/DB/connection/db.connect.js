import mongoose from "mongoose";

const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log(`DB connected successfully ✅`);
    })
    .catch((err) => {
      console.log(`Fail to connect DB ❎`, err);
    });
};

export default dbConnection;
