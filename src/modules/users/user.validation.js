import joi from "joi"
import { genderEnum } from "../../common/enum/user.enum.js"
import { generalRules } from "../../common/utils/generalRules.js"

export const signUpSchema = {
    body: joi.object({
        userName: joi.string().trim().min(2).required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cPassword: generalRules.cPassword.required(),
        gender: joi.string().valid(...Object.values(genderEnum)).required(),
        phone: joi.string().required()
    }).required(),

    // file: generalRules.file.required(),
    
    // files: joi.array().max(5).items(generalRules.file.required()).required(),

    files: joi.object({
        attachment: joi.array().max(1).items(generalRules.file.required()).required(),
        attachments: joi.array().max(5).items(generalRules.file.required()).required(),
    }).required()
}

export const signInSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required()
    }).required(),
}

export const shareProfileSchema = {
    params: joi.object({
       id: generalRules.id.required()
    }).required(),
}

export const updateProfileSchema = {
    body: joi.object({
    firstName:joi.string().trim().min(2),
    lastName:joi.string().trim().min(2),
      gender: joi.string().valid(...Object.values(genderEnum)),
      phone: joi.string()
    }).required(),
}

export const updatePasswordSchema = {
    body: joi.object({
    newPassword:generalRules.password.required(),
    oldPassword:generalRules.password.required(),
    cPassword: joi.string().valid(joi.ref("newPassword"))
    }).required(),
}
