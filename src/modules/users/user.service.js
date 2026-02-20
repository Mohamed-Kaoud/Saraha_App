import { providerEnum } from "../../common/enum/user.enum.js";
import { successResponse } from "../../common/utils/response.success.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { GenerateToken, VerifyToken } from "../../common/utils/token.service.js";
import { v4 as uuidv4 } from "uuid";
import * as db_service from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import  {OAuth2Client} from "google-auth-library"
import { AUDIENCE, SALT_ROUNDS, SECRET_KEY } from "../../../config/config.service.js";

export const signUp = async (req, res) => {
  const { userName, email, password, cPassword, gender, phone,role } = req.body;
  if (password !== cPassword) {
    throw new Error("Confirmed password must match the password 🔴", {
      cause: 400,
    });
  }
  if (await db_service.findOne({ model: userModel, filter: { email } })) {
    throw new Error(`Email ${email} already exist 🔴`, { cause: 409 });
  }

  const user = await db_service.create({
    model: userModel,
    data: {
      userName,
      email,
      password: Hash({ plain_text: password, salt_rounds: SALT_ROUNDS }),
      gender,
      phone: encrypt(phone),
      role
    },
  });

  successResponse({
    res,
    status: 201,
    message: "User signed up successfully ✅",
    data: user,
  });
};

export const signUpWithGmail = async (req,res) => {
  const {idToken} = req.body

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience: AUDIENCE
  });
  const payload = ticket.getPayload();
 
  const {name , email , email_verified , picture} = payload

  let user = await db_service.findOne({model:userModel , filter: {email}})
  
  if(!user){
    user = await db_service.create({
      model:userModel,
      data:{
        userName: name,
        email,
        confirmed: email_verified,
        profilePicture: picture,
        provider: providerEnum.google
          }
    })
  }

  if(user.provider == providerEnum.system){
    throw new Error("Please, Login with system" , {cause: 400})
  }

  const access_token = GenerateToken({
    payload: {id:user._id},
    secret_key: SECRET_KEY,
    options:{
      jwtid:uuidv4()
    }
  })

  successResponse({res,message:"Success Login with gmail ✅" , data: {access_token}})
}

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await db_service.findOne({
    model: userModel,
    filter: { email, provider: providerEnum.system },
  });
  if (!user) {
    throw new Error(`Invalid email ❎`, { cause: 400 });
  }
  const match = Compare({ plain_text: password, cipher_text: user.password });
  if (!match) {
    throw new Error("Invalid password ❎", { cause: 400 });
  }
  const access_token = GenerateToken({
    payload: { id: user._id },
    secret_key: SECRET_KEY,
    options: {
      jwtid: uuidv4(),
    },
  });
  successResponse({
    res,
    status: 201,
    message: "User signed in successfully ✅",
    data: { access_token },
  });
};

export const getProfile = async (req, res) => {

  successResponse({res,data:{...req.user._doc , phone:decrypt(req.user.phone)}})
};
