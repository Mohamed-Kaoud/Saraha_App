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
import { ACCESS_SECRET_KEY, AUDIENCE, PREFIX, REFRESH_SECRET_KEY, SALT_ROUNDS, SECRET_KEY } from "../../../config/config.service.js";
import cloudinary from "../../common/utils/cloudinary.js";

export const signUp = async (req, res) => {
  const uploadedCloudFiles = [];

  try {
    const { userName, email, password, cPassword, gender, phone, role } =
      req.body;

    if (password !== cPassword) {
      throw new Error("Confirmed password must match the password 🔴", {
        cause: 400,
      });
    }

    if (await db_service.findOne({ model: userModel, filter: { email } })) {
      throw new Error(`Email ${email} already exist 🔴`, { cause: 409 });
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.attachment[0].path,
      { folder: "uploads/users" }
    );

    uploadedCloudFiles.push(public_id);

    const arr_paths = [];

    for (const file of req.files.attachments) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: "uploads/users" }
      );

      uploadedCloudFiles.push(public_id);

      arr_paths.push({ secure_url, public_id });
    }

    const user = await db_service.create({
      model: userModel,
      data: {
        userName,
        email,
        password: Hash({ plain_text: password, salt_rounds: SALT_ROUNDS }),
        gender,
        phone: encrypt(phone),
        profilePicture: { secure_url, public_id },
        coverPictures: arr_paths,
      },
    });

    successResponse({
      res,
      status: 201,
      message: "User signed up successfully ✅",
      data: user,
    });
  } catch (error) {
    if (req.files) {
      for (const key in req.files) {
        for (const file of req.files[key]) {
          fs.unlinkSync(file.path);
        }
      }
    }

    for (const id of uploadedCloudFiles) {
      await cloudinary.uploader.destroy(id);
    }

    throw error;
  }
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
    secret_key: ACCESS_SECRET_KEY,
    options: {
      jwtid: uuidv4(),
      expiresIn: 60 * 30
    },
  });

    const refresh_token = GenerateToken({
    payload: { id: user._id },
    secret_key: REFRESH_SECRET_KEY,
    options: {
      jwtid: uuidv4(),
      expiresIn: "1y"
    },
  });

  successResponse({
    res,
    status: 201,
    message: "User signed in successfully ✅",
    data: { access_token , refresh_token },
  });
};

export const getProfile = async (req, res) => {

  successResponse({res,data:{...req.user._doc , phone:decrypt(req.user.phone)}})
};

export const shareProfile = async (req,res) => {
  const {id} = req.params
   const user = await db_service.findById({model:userModel , 
    id,
    options: {select:"-password"}
   })

   if(!user){
    throw new Error("User not exist")
   }

   user.phone = decrypt(user.phone)

   successResponse({res, data:user})
}

export const refreshToken = async (req,res) => {
  const {authorization} = req.headers

  
    if (!authorization) {
      throw new Error("Token is required 🔴", { cause: 400 });
    }
  
    const [prefix,token] = authorization.split(" ")
    if(prefix !== PREFIX){
      throw new Error("Ivalid prefix" , {cause: 400})
    }
  
    const decoded = VerifyToken({token , secret_key: REFRESH_SECRET_KEY})
  
    if (!decoded || !decoded?.id) {
      throw new Error("Invalid token ❎", { cause: 400 });
    }
  
    const user = await db_service.findById({model:userModel , id:decoded.id , options:{select:"-password"}})
  
    if(!user){
      throw new Error("User not found" , {cause: 404})
    }

      const access_token = GenerateToken({
        payload: { id: user._id },
        secret_key: ACCESS_SECRET_KEY,
        options: {
          jwtid: uuidv4(),
          expiresIn: 60 * 30
        },
      });

      successResponse({res, data: {access_token}})
}

export const updateProfile = async (req,res) => {
  let {firstName,lastName,gender,phone} = req.body

  if(phone){
    phone = encrypt(phone)
  }

  const user = await db_service.findOneAndUpdate({
    model: userModel,
    filter: {_id: req.user._id},
    update: {firstName,lastName,gender,phone},
  })

   if(!user){
    throw new Error("User not exist")
   }

   successResponse({res , data: user})
}

export const updatePassword = async (req,res) => {
  let {oldPassword,newPassword} = req.body

  if(!Compare({plain_text: oldPassword , cipher_text: req.user.password})){
    throw new Error("Invalid old password")
  }

    const hash = Hash({plain_text: newPassword, salt_rounds: SALT_ROUNDS})

    req.user.password = hash

  await req.user.save()

   successResponse({res})
}