import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providerEnum.google ? false : true;
      },
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.male,
    },
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.system,
    },
    role:{
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.user
    },
    phone: {
      type: String,
    },
    profilePicture: String,
    confirmed: Boolean,
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (v) {
    const [firstName, lastName] = v.split(" ") || [];
    this.set({ firstName, lastName });
  });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
