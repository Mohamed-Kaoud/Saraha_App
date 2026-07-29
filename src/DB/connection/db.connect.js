import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DB connected successfully ✅");
  } catch (err) {
    console.error("Fail to connect DB ❎", err);
    throw err;
  }
};

export default dbConnection;