import nodemailer from "nodemailer"

export const sendEmail = async ({to,subject,html}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const Info = await transporter.sendMail({
        from: `"Mohamed Elsayed 😎" <${process.env.EMAIL}>`, 
        to,
        subject: subject || "Hello ✅",
        html: html || "<b>Hello from Saraha_App</b>"
    })

    console.log("Message sent: %s", Info.messageId);

    return Info.accepted.length > 0 ? true : false
    
}

export const generateOTP = () => {
    return Math.floor(Math.random() * 900000 + 100000)
}