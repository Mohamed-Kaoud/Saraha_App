import mongoose from "mongoose";

const checkConnectionDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/Saraha_App" , {serverSelectionTimeoutMS:1000})
    .then(() => {
        console.log(`DB connected successfully ✅`);
    })
    .catch((err) => {
        console.log(`Fail to connect DB ❌` , {Error: err.message});
    })
}

export default checkConnectionDB