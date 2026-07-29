import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    userName: {
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
      required: function() {
        return this.provider == ProviderEnum.system ? true : false
      },
      trim: true,
    },
    phone: String,
    age: {
      type: Number,
      required: function() {
        return this.provider == ProviderEnum.system ? true : false
      },
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.male,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.system,
    },
    profilePicture: {
      secure_url: String,
      public_id: String,
    },
    isConfirmed: Boolean,
    changeCredentials: Date,
  },
  {
    timestamps: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
