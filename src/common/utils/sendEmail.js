import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mohamed7363@gmail.com",   
      pass: "abcd efgh ijkl mnop",     
    },
  });

  await transporter.sendMail({
    to: to,
    subject: "OTP",
    text: `Your OTP is: ${otp}`,
  });
};
