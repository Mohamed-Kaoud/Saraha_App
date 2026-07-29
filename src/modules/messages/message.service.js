import { deleteImages, uploadImage, uploadImages } from "../../common/utils/service/cloudinary/cloudinary.service.js"
import UserRepo from "../../DB/repositories/user.repository.js"
import MessageRepo from "../../DB/repositories/message.repository.js"

export const sendMessage = async (body, files) => {
    const {message, receiverId} = body

    const user = await UserRepo.findById({id: receiverId})

    if(!user) {
        throw new Error("User not found ❎", {cause: 404})
    }

    const images = await uploadImages({
        files,
        folder: "Saraha_Clone/Messages/images"
    })

    const Message = await MessageRepo.create({
        message,
        receiverId,
        attachments: images
    })

    if(!Message) {
        await deleteImages(images.map((image) => {
            return image.public_id
        }))
        throw new Error("Failed to send message ❎")
    }

    return Message

}

export const getMessage = async (messageId,user) => {
    const message = await MessageRepo.findOne({
        filter: {
            _id: messageId,
            receiverId: user._id
        }
    })

    if(!message) {
        throw new Error("Message not found or You are not allowed to access this message ❎", {cause: 404})
    }

    return message
}

export const getMessages = async (user) => {
    const messages = await MessageRepo.find({
        filter: {
            receiverId: user._id
        },
        populate:[
            {
                path: "receiverId",
                select: "userName gender age profilePicture"
            }
        ]
    })

    if(messages.length == 0) {
        throw new Error("No messages found ❎", {cause: 404})
    }

    return messages
}

export const deleteMessage = async (messageId, user) => {
    const message = await MessageRepo.findOneAndDelete(
        {
        _id: messageId,
        receiverId: user._id
        }
    )

    if(!message) {
        throw new Error("Message not found or You are not allowed to delete this message ❎", {cause: 404})
    }

    if(message.attachments?.length) {
        await deleteImages(message.attachments.map((image) => {
            return image.public_id
        }))
    }
}