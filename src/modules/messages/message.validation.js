import joi from "joi"
import { Types } from "mongoose"

export const sendMessageSchema = {
    body: joi.object({
        message: joi.string().min(1).max(1000).required(),
        receiverId: joi.string().custom((value,helper) => {
            const isValid = Types.ObjectId.isValid(value)
            return isValid ? value : helper.message("Invalid id ❎")
        }).required()
    }).required(),
    
    files: joi.array().items(joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required()
    }).messages({
        'any.required':"File is required"
    })).max(5)
}

export const getMessageSchema = {
    params: joi.object({
        messageId: joi.string().custom((value,helper) => {
            const isValid = Types.ObjectId.isValid(value)
            return isValid ? value : helper.message("Invalid message id ❎")
        }).required()
    }).required()
}

export const deleteMessageSchema = {
    params: joi.object({
        messageId: joi.string().custom((value,helper) => {
            const isValid = Types.ObjectId.isValid(value)
            return isValid ? value : helper.message("Invalid message id ❎")
        }).required()
    }).required()
}