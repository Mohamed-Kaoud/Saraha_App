import { Router } from "express";
import * as MessageService from "./message.service.js"
import { Multer_Host } from "../../common/middleware/multer.js";
import { MulterEnum } from "../../common/enum/multer.enum.js";
import { Validation } from "../../common/middleware/validation.js";
import { deleteMessageSchema, getMessageSchema, sendMessageSchema } from "./message.validation.js";
import { Authentication } from "../../common/middleware/authentication.js";

const messageRouter = Router()

messageRouter.post("/send", Multer_Host(MulterEnum.image).array("attachments", 5), Validation(sendMessageSchema), async(req,res,next) => {
    const message = await MessageService.sendMessage(req.body, req.files)
    res.status(201).json({message: "Message sent successfully ✅", data: message})
})

messageRouter.get("/", Authentication, async (req,res,next) => {
    const messages = await MessageService.getMessages(req.user)
    res.status(200).json({data: messages})
})

messageRouter.get("/:messageId", Authentication,Validation(getMessageSchema), async (req,res,next) => {
    const message = await MessageService.getMessage(req.params.messageId,req.user)
    res.status(200).json({data: message})
})

messageRouter.delete("/delete/:messageId", Authentication, Validation(deleteMessageSchema), async(req,res,next) => {
    await MessageService.deleteMessage(req.params.messageId, req.user)
    res.status(200).json({message: "Message deleted successfully ✅"})
})

export default messageRouter