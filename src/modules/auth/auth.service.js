import { EmailEnum } from "../../common/enum/email.enum.js";
import { ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";
import { eventEmitter } from "../../common/utils/email/email.events.js";
import {
  EmailTemplate,
  forgetPasswordTemplate,
  updateEmailTemplate,
} from "../../common/utils/email/email.template.js";
import { generateOTP, sendEmail } from "../../common/utils/email/send.email.js";
import { Encrypt } from "../../common/utils/security/encryption.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import {
  deleteImage,
  uploadImage,
} from "../../common/utils/service/cloudinary/cloudinary.service.js";
import {
  blocked_otp_key,
  deleteKey,
  get,
  get_key,
  increaseKey,
  keys,
  keyTTL,
  max_otp_key,
  otp_key,
  revoked_token,
  setValue,
} from "../../common/utils/service/redis/redis.service.js";
import {
  GenerateToken,
  VerifyToken,
} from "../../common/utils/service/token/token.service.js";
import UserRepo from "../../DB/repositories/user.repository.js";
import { randomUUID } from "node:crypto";
import { OAuth2Client } from "google-auth-library";

export const sendOTP = async ({ email, type }) => {
  const isBlocked = await keyTTL(blocked_otp_key({ email, type }));
  if (isBlocked > 0) {
    throw new Error(
      `You are blocked yet, try again after ${isBlocked} seconds.. 🔴`,
      { cause: 400 },
    );
  }

  const otpTTL = await keyTTL(otp_key({ userEmail: email, type }));
  if (otpTTL > 0) {
    throw new Error(`We can resend OTP after ${otpTTL} seconds.. 🔴`, {
      cause: 400,
    });
  }

  const exceededMaxOTP = await get(max_otp_key({ email, type }));
  if (exceededMaxOTP >= 3) {
    await setValue({
      key: blocked_otp_key({ email, type }),
      value: 1,
      ttl: 60 * 2,
    });
    await deleteKey(max_otp_key({ email, type }));
    throw new Error("You have exceeded the maximum number of tries 🔴", {
      cause: 400,
    });
  }

  const otp = generateOTP();

  let html
  if(type == EmailEnum.confirmEmail){
    html = EmailTemplate(otp)
  }else if(type == EmailEnum.forgetPassword){
    html = forgetPasswordTemplate(otp)
  }else if(type == EmailEnum.updateEmail){
    html = updateEmailTemplate(otp)
  }

  eventEmitter.emit(type, async () => {
    await sendEmail({
      to: email,
      subject: "Welcome from Saraha App 😍",
      html
    });

    await setValue({
      key: otp_key({ userEmail: email, type }),
      value: Hash({ plain_text: `${otp}` }),
      ttl: 60 * 2,
    });

    if (!(await get(max_otp_key({ email, type })))) {
      await setValue({
        key: max_otp_key({ email, type }),
        value: 1,
        ttl: 60 * 6,
      });
    } else {
      await increaseKey(max_otp_key({ email, type }));
    }
  });
};

export const signUp = async (body, file) => {
  const { userName, email, password, phone, age, gender } = body;

  if (await UserRepo.findOne({ filter: { email } })) {
    throw new Error(`Email => ${email} already exist ❎`, { cause: 409 });
  }

  let uploadedImage;
  if (file) {
    const image = await uploadImage({
      file,
      folder: "Saraha_Clone/userPicture",
    });
    uploadedImage = image;
  }

  const user = await UserRepo.create({
    userName,
    email,
    password: Hash({ plain_text: password }),
    phone: Encrypt(phone),
    age,
    profilePicture: uploadedImage,
    gender,
  });

  if (!user) {
    if (uploadedImage) {
      await deleteImage(uploadedImage.public_id);
    }
    throw new Error("Failed to sign up ❎");
  }

  await sendOTP({ email, type: EmailEnum.confirmEmail });

  return user;
};

export const confirmEmail = async (body) => {
  const { email, otp } = body;
  if (
    !(await UserRepo.findOne({
      filter: {
        email,
        isConfirmed: { $exists: false },
      },
    }))
  ) {
    throw new Error(" User not found or already confirmed ❎", { cause: 404 });
  }
  const otpValue = await get(
    otp_key({ userEmail: email, type: EmailEnum.confirmEmail }),
  );
  if (!otpValue) {
    throw new Error("OTP expired ❎", { cause: 404 });
  }
  if (!Compare({ plain_text: otp, cipher_text: otpValue })) {
    throw new Error("You entered invalid otp ❎", { cause: 400 });
  }

  const user = UserRepo.findOneAndUpdate({
    filter: {
      email,
      provider: ProviderEnum.system,
    },
    update: {
      isConfirmed: true,
    },
  });

  await deleteKey(otp_key({ userEmail: email, type: EmailEnum.confirmEmail }));

  return user;
};

export const resendOTP = async (body) => {
  const { email } = body;
  const user = await UserRepo.findOne({
    filter: {
      email,
      isConfirmed: { $exists: false },
      provider: ProviderEnum.system,
    },
  });
  if (!user) {
    throw new Error("User not found or already confirmed ❎", { cause: 400 });
  }

  await sendOTP({ email, type: EmailEnum.confirmEmail });

  return user;
};

export const signIn = async (body) => {
  const { email, password } = body;

  const user = await UserRepo.findOne({
    filter: {
      email,
      provider: ProviderEnum.system,
      isConfirmed: { $exists: true },
    },
  });

  if (!user) {
    throw new Error("User not found or email not confirmed ❎", { cause: 404 });
  }

  if (!Compare({ plain_text: password, cipher_text: user.password })) {
    throw new Error("You entered invalid password ❎", { cause: 400 });
  }

  const jwtid = randomUUID();

  const access_token = GenerateToken({
    payload: { id: user._id },
    secret_key:
      user.role == RoleEnum.user
        ? process.env.ACCESS_SECRET_KEY_USER
        : process.env.ACCESS_SECRET_KEY_ADMIN,
    options: {
      jwtid,
      expiresIn: "1d",
    },
  });

  const refresh_token = GenerateToken({
    payload: { id: user._id },
    secret_key:
      user.role == RoleEnum.user
        ? process.env.REFRESH_SECRET_KEY_USER
        : process.env.REFRESH_SECRET_KEY_ADMIN,
    options: {
      jwtid,
      expiresIn: "30d",
    },
  });

  return { user, access_token, refresh_token };
};

export const signUpWithGmail = async (body) => {
  const { idToken } = body;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.AUDIENCE,
  });
  const payload = ticket.getPayload();

  const { name, email, email_verified, picture } = payload;

  let user = await UserRepo.findOne({ filter: { email } });
  if (!user) {
    user = await UserRepo.create({
      userName: name,
      email,
      isConfirmed: email_verified,
      profilePicture: {
        secure_url: picture,
        public_id: null,
      },
      provider: ProviderEnum.google,
    });
  }

  if (user.provider == ProviderEnum.system) {
    throw new Error("Please signup with system ❎", { cause: 400 });
  }

  const access_token = GenerateToken({
    payload: { id: user._id },
    secret_key: process.env.ACCESS_SECRET_KEY,
    options: {
      jwtid: randomUUID(),
      expiresIn: "1d",
    },
  });

  return access_token;
};

export const refreshToken = async (headers) => {
  const { authorization } = headers;
  if (!authorization) {
    throw new Error("Refresh token is required 🔴", { cause: 404 });
  }

  const [prefix, token] = authorization.split(" ");
  if (!prefix || !token) {
    throw new Error("Prefix or token is missed ❎", { cause: 400 });
  }

  let secret_key;

  secret_key =
    prefix == process.env.USER_PREFIX
      ? process.env.REFRESH_SECRET_KEY_USER
      : process.env.REFRESH_SECRET_KEY_ADMIN;

  const decoded = VerifyToken({ token, secret_key });
  if (!decoded || !decoded?.id) {
    throw new Error("Invalid token ❎", { cause: 400 });
  }

  const user = await UserRepo.findById({ id: decoded.id });

  if (!user) {
    throw new Error("User not found ❎", { cause: 404 });
  }

  const access_token = GenerateToken({
    payload: { id: user._id },
    secret_key:
      user.role == RoleEnum.user
        ? process.env.ACCESS_SECRET_KEY_USER
        : process.env.ACCESS_SECRET_KEY_ADMIN,
    options: {
      jwtid: randomUUID(),
      expiresIn: "1d",
    },
  });
  return access_token;
};

export const forgetPassword = async (body) => {
  const { email } = body;
  if (
    !(await UserRepo.findOne({
      filter: {
        email,
        isConfirmed: { $exists: true },
        provider: ProviderEnum.system,
      },
    }))
  ) {
    throw new Error("Invalid email or email not confirmed ❎", { cause: 400 });
  }

  await sendOTP({ email, type: EmailEnum.forgetPassword });
};

export const resetPassword = async (body) => {
  const { email, otp, password } = body;

  const otpValue = await get(
    otp_key({ userEmail: email, type: EmailEnum.forgetPassword }),
  );
  if (!otpValue) {
    throw new Error("OTP expired ❎", { cause: 404 });
  }

  if (!Compare({ plain_text: otp, cipher_text: otpValue })) {
    throw new Error("You entered invalid OTP ❎", { cause: 400 });
  }

  const user = await UserRepo.findOneAndUpdate({
    filter: {
      email,
      isConfirmed: { $exists: true },
      provider: ProviderEnum.system,
    },
    update: {
      password: Hash({ plain_text: password }),
      changeCredentials: new Date(),
    },
  });

  if (!user) {
    throw new Error("User not found or email not confirmed ❎", { cause: 404 });
  }

  await deleteKey(
    otp_key({ userEmail: email, type: EmailEnum.forgetPassword }),
  );
};

export const logout = async (user, decoded, query) => {
  const { flag } = query;
  if (flag == "all") {
    user.changeCredentials = new Date();
    await user.save();
    await deleteKey(await keys(get_key(user._id)));
  } else {
    await setValue({
      key: revoked_token({ userId: user._id, jti: decoded.jti }),
      value: decoded.jti,
      ttl: decoded.exp - Math.floor(Date.now() / 1000),
    });
  }
};
