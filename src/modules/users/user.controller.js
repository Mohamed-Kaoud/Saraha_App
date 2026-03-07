import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { multer_host, multer_local } from "../../common/middleware/multer.js";
import { multerEnum } from "../../common/enum/multer.enum.js";
import { validation } from "../../common/middleware/validation.js";
import { shareProfileSchema, signInSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";

const userRouter = Router();

userRouter.post(
  "/signup",
  multer_host(multerEnum.image).fields([
    { name: "attachment", maxCount: 1 },
    { name: "attachments", maxCount: 5 },
  ]),validation(signUpSchema),
  US.signUp,
);
userRouter.post("/signIn",validation(signInSchema) ,US.signIn);
userRouter.post("/signup/gmail", US.signUpWithGmail);
userRouter.get("/refresh-token" , US.refreshToken)
userRouter.get(
  "/profile",
  authentication,
  authorization([roleEnum.admin]),
  US.getProfile,
);
userRouter.patch("/update-profile" ,validation(updateProfileSchema) ,authentication , US.updateProfile)
userRouter.get("/share-profile/:id" , validation(shareProfileSchema),US.shareProfile)
userRouter.patch("/update-password" , authentication,validation(updatePasswordSchema) , US.updatePassword)

export default userRouter;
