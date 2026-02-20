import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

const checkConnectionDB = async () => {
    await mongoose.connect(DB_URI , {serverSelectionTimeoutMS:1000})
    .then(() => {
        console.log(`DB connected successfully ✅`);
    })
    .catch((err) => {
        console.log(`Fail to connect DB ❌` , {Error: err.message});
    })
}

export default checkConnectionDB