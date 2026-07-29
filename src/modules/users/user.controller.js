import { Router } from "express";
import * as UserService from "./user.service.js";
import { Authentication } from "../../common/middleware/authentication.js";
import { Decrypt } from "../../common/utils/security/encryption.security.js";
import { Authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { Validation } from "../../common/middleware/validation.js";
import { confirmUpdateEmailSchema, shareProfileSchema, updateEmailSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { Multer_Host } from "../../common/middleware/multer.js";
import { MulterEnum } from "../../common/enum/multer.enum.js";
import messageRouter from "../messages/message.controller.js";

const userRouter = Router();

userRouter.get("/profile", Authentication, Authorization(RoleEnum.user), async (req, res, next) => {
   const user = await UserService.getProfile(req.user);
  res
    .status(200)
    .json({ Profile: { ...user._doc, phone: Decrypt(user.phone) } });
});

userRouter.patch("/update-profile", Authentication,Validation(updateProfileSchema), async (req,res,next) => {
  const user = await UserService.updateProfile(req.user, req.body)
  res.status(200).json({message: `Profile updated successfully ✅`, user})
})

userRouter.patch("/update-password", Authentication,Validation(updatePasswordSchema), async (req,res,next) => {
  await UserService.updatePassword(req.user, req.body)
  res.status(200).json({message: "Password updated successfully ✅"})
})

userRouter.patch("/update-email", Authentication,Validation(updateEmailSchema), async (req,res,next) => {
  await UserService.updateEmail(req.user, req.body)
  res.status(200).json({message: "Update email OTP sent successfully ✅"})
})

userRouter.patch("/confirm-update-email", Authentication,Validation(confirmUpdateEmailSchema), async (req,res,next) => {
  await UserService.confirmUpdateEmail(req.user, req.body)
  res.status(200).json({message: "Email updated successfully ✅"})
})

userRouter.patch("/update-profile-picture", Authentication, Multer_Host(MulterEnum.image).single("image"), async (req,res,next) => {
  await UserService.updateProfilePicture(req.user,req.file)
  res.status(200).json({message: "Profile picture updated successfully ✅"})
})

userRouter.get("/share-profile/:id", Validation(shareProfileSchema), async (req,res,next) => {
  const user = await UserService.shareProfile(req.params.id)
  res.status(200).json({Profile: user})
})


export default userRouter;
