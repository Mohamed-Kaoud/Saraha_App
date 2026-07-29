import joi from "joi";
import { GenderEnum } from "../../common/enum/user.enum.js";

export const signUpSchema = {
  body: joi.object({
    userName: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    cPassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Confirmed password does not match password ❎.",
      "string.empty": "Confirm password is required.",
      "any.required": "Confirm password is required.",
    }),
    age: joi.number().integer().min(18).max(120),
    phone: joi.string()
      .pattern(/^01[0125]\d{8}$/)
      .messages({
        "string.pattern.base":
          "Phone number must be a valid Egyptian mobile number (11 digits) ❎.",
      }),
      gender: joi.string().valid(...Object.values(GenderEnum))
  }).required()
};

export const confirmEmailSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    otp:  joi.string().pattern(/^\d{6}$/).required()
  }).required()
}

export const resendOTPSchema = {
  body: joi.object({
    email: joi.string().email().required(),
  }).required()
}

export const signInSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  }).required()
}

export const resetPasswordSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    otp: joi.string().pattern(/^\d{6}$/).required(),
    password: joi.string().min(6).required(),
    cPassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Confirmed password does not match password ❎.",
      "string.empty": "Confirm password is required.",
      "any.required": "Confirm password is required.",
    }),
  }).required()
}
