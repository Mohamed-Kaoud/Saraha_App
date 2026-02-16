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

export const signUp = async (req, res) => {
  const { userName, email, password, cPassword, gender, phone } = req.body;
  if (password !== cPassword) {
    throw new Error("Confirmed password must match the password 🔴", {
      cause: 400,
    });
  }
  if (await db_service.findOne({ model: userModel, filter: { email } })) {
    throw new Error(`Email ${email} already exist 🔴`, { cause: 400 });
  }

  const user = await db_service.create({
    model: userModel,
    data: {
      userName,
      email,
      password: Hash({ plain_text: password, salt_rounds: 12 }),
      gender,
      phone: encrypt(phone),
    },
  });

  successResponse({
    res,
    status: 201,
    message: "User signed up successfully ✅",
    data: user,
  });
};

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
    secret_key: "mohamed",
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
