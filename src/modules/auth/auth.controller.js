import { Router } from "express";
import * as AuthService from "./auth.service.js"
import { Validation } from "../../common/middleware/validation.js";
import { confirmEmailSchema, resendOTPSchema, resetPasswordSchema, signInSchema, signUpSchema } from "./auth.validation.js";
import { Multer_Host } from "../../common/middleware/multer.js";
import { MulterEnum } from "../../common/enum/multer.enum.js";
import { Authentication } from "../../common/middleware/authentication.js";

const authRouter = Router()

authRouter.post("/signup",Multer_Host(MulterEnum.image).single("image"),Validation(signUpSchema),async (req,res,next) => {
   const user = await AuthService.signUp(req.body,req.file)
    res.status(201).json({message:"User created successfully ✅", user })
})

authRouter.patch("/confirm-email", Validation(confirmEmailSchema) ,async (req,res,next) => {
    const user = await AuthService.confirmEmail(req.body)
    res.status(200).json({message: `${user.userName}'s email confirmed successfully ✅`})
})

authRouter.post("/resend-otp", Validation(resendOTPSchema) ,async(req,res,next) => {
    const user = await AuthService.resendOTP(req.body)
    res.status(200).json({message:`OTP resent to ${user.email} successfully ✅`})
})

authRouter.post("/signin", Validation(signInSchema) ,async(req,res,next) => {
    const {user, access_token,refresh_token} = await AuthService.signIn(req.body)
    res.status(200).json({message:` ${user.userName} signed in successfully ✅`, access_token, refresh_token})
})

authRouter.post("/signup/gmail", async(req,res,next) => {
    const access_token = await AuthService.signUpWithGmail(req.body)
    res.status(200).json({message: "Success login with gmail ✅", data: {access_token}})
})

authRouter.post("/refresh-token", async (req,res,next) => {
    const access_token = await AuthService.refreshToken(req.headers)
    res.status(200).json({access_token})
})

authRouter.post("/forget-password", async(req,res,next) => {
    await AuthService.forgetPassword(req.body)
    res.status(200).json({message:`Forget password OTP sent successfully ✅`})
})

authRouter.patch("/reset-password", Validation(resetPasswordSchema),async(req,res,next) => {
    await AuthService.resetPassword(req.body)
    res.status(200).json({message:`Password reset operation done successfully ✅`})
})

authRouter.post("/logout", Authentication, async (req,res,next) => {
    await AuthService.logout(req.user,req.decoded,req.query)
    res.status(200).json({message: `${req.user.userName} logged out successfully ✅`})
})

export default authRouter