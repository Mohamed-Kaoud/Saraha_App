import joi from "joi";
import { GenderEnum } from "../../common/enum/user.enum.js";
import { Types } from "mongoose";

export const updateProfileSchema = {
  body: joi.object({
    userName: joi.string().min(2).max(50),
    age: joi.number().integer().min(18).max(120),
    gender: joi.string().valid(...Object.keys(GenderEnum)),
    phone: joi
      .string()
      .pattern(/^01[0125]\d{8}$/)
      .messages({
        "string.pattern.base":
          "Phone number must be a valid Egyptian mobile number (11 digits) ❎.",
      }),
  }),
};

export const updatePasswordSchema = {
  body: joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().min(6).required(),
    cPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
      "any.only": "Confirmed password does not match the new password ❎.",
      "string.empty": "Confirmed password is required.",
      "any.required": "Confirmed password is required.",
    }),
  }),
};

export const updateEmailSchema = {
  body: joi.object({
    newEmail: joi.string().email().required(),
    password: joi.string().min(6).required()
  }).required()
}

export const confirmUpdateEmailSchema = {
  body: joi.object({
    newEmail: joi.string().email().required(),
    otp: joi.string().pattern(/^\d{6}$/).required()
  }).required()
}

export const shareProfileSchema = {
  params: joi.object({
        id: joi.string().custom((value,helper) => {
        const isValid = Types.ObjectId.isValid(value)
        return isValid ? value : helper.message("Invalid id ❎")
    }).required()
  }).required()
}