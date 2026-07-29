import { EmailEnum } from "../../common/enum/email.enum.js";
import { Decrypt, Encrypt } from "../../common/utils/security/encryption.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import {
  deleteImage,
  uploadImage,
} from "../../common/utils/service/cloudinary/cloudinary.service.js";
import {
  deleteKey,
  get,
  otp_key,
  setValue,
  userProfile,
} from "../../common/utils/service/redis/redis.service.js";
import UserRepo from "../../DB/repositories/user.repository.js";
import { sendOTP } from "../auth/auth.service.js";

export const getProfile = async (user) => {
  return user;
};

export const updateProfile = async (user, body) => {
  let { userName, phone, age, gender } = body;

  if (phone) {
    phone = Encrypt(phone);
  }

  const updatedProfile = await UserRepo.findOneAndUpdate({
    filter: {
      _id: user._id,
    },
    update: {
      userName,
      phone,
      age,
      gender,
    },
  });

  if (!updatedProfile) {
    throw new Error("User not found ❎", { cause: 404 });
  }

  return updatedProfile;
};

export const updatePassword = async (user, body) => {
  const { oldPassword, newPassword } = body;

  if (!Compare({ plain_text: oldPassword, cipher_text: user.password })) {
    throw new Error("You entered invalid old password ❎", { cause: 400 });
  }

  const User = await UserRepo.findOneAndUpdate({
    filter: {
      _id: user._id,
    },
    update: {
      password: Hash({ plain_text: newPassword }),
      changeCredentials: new Date(),
    },
  });

  if (!User) {
    throw new Error("User not found ❎", { cause: 404 });
  }
};

export const updateEmail = async (user, body) => {
  const { password, newEmail } = body;

  if (!Compare({ plain_text: password, cipher_text: user.password })) {
    throw new Error("Invalid password ❎", { cause: 400 });
  }

  if (newEmail === user.email) {
    throw new Error("Please enter another email.. 🔴", { cause: 400 });
  }

  const emailExist = await UserRepo.findOne({ filter: { email: newEmail } });

  if (emailExist) {
    throw new Error("New email is not available .. choose another email 🔴", {
      cause: 409,
    });
  }

  await sendOTP({ email: newEmail, type: EmailEnum.updateEmail });
};

export const confirmUpdateEmail = async (user, body) => {
  const { newEmail, otp } = body;

  const otpValue = await get(
    otp_key({ userEmail: newEmail, type: EmailEnum.updateEmail }),
  );

  if (!otpValue) {
    throw new Error("OTP expired ❎", { cause: 404 });
  }

  if (!Compare({ plain_text: otp, cipher_text: otpValue })) {
    throw new Error("Invalid OTP ❎", { cause: 404 });
  }

  const updatedUser = await UserRepo.findOneAndUpdate({
    filter: {
      _id: user._id,
    },
    update: {
      email: newEmail,
      changeCredentials: new Date(),
    },
  });

  if (!updatedUser) {
    throw new Error("User not found ❎", { cause: 404 });
  }

  await deleteKey(
    otp_key({
      userEmail: newEmail,
      type: EmailEnum.updateEmail,
    }),
  );
};

export const updateProfilePicture = async (user, file) => {
  if (!file) {
    throw new Error("Nothing to update ❎..Please, provide the new picture", {
      cause: 400,
    });
  }

  const updatedPicture = await uploadImage({
    file,
    folder: "Saraha_Clone/userPicture",
  });

  const oldPictureID = user.profilePicture?.public_id;

  try {
    user.profilePicture = updatedPicture;
    await user.save();
    if (oldPictureID) {
      await deleteImage(oldPictureID);
    }
  } catch (error) {
    await deleteImage(updatedPicture.public_id);
    throw error;
  }
};

export const shareProfile = async (id) => {
   const user = await UserRepo.findById({
    id,
    select: "-password"
   })
   if(!user) {
    throw new Error("User not found ❎", {cause: 404})
   }

   user.phone = Decrypt(user.phone)

   return user
}
