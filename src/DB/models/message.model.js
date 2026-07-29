import mongoose, { Types } from "mongoose";


export const messageSchema = new mongoose.Schema({
    receiverId: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },

    message: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 1000
    },

    attachments: [
        {
            secure_url: String,
            public_id: String
        }
    ]

},{
    timestamps: true,
    strictQuery: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

export const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)