import { VerifyToken } from "../utils/service/token/token.service.js";
import UserRepo from "../../DB/repositories/user.repository.js";
import { get, revoked_token } from "../utils/service/redis/redis.service.js";
export const Authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("Token is required 🔴", { cause: 404 });
  }

  const [prefix, token] = authorization.split(" ");

  if (!prefix || !token) {
    throw new Error("Prefix or token is missed ❎", { cause: 400 });
  }

  let secret_key;

  secret_key =
    prefix == process.env.USER_PREFIX
      ? process.env.ACCESS_SECRET_KEY_USER
      : process.env.ACCESS_SECRET_KEY_ADMIN;

  const decoded = VerifyToken({ token, secret_key });

  if (!decoded || !decoded?.id) {
    throw new Error("Invalid token ❎", { cause: 400 });
  }

  const user = await UserRepo.findById({ id: decoded.id });
  if (!user) {
    throw new Error("User not found ❎", { cause: 404 });
  }

  if(user?.changeCredentials?.getTime() > decoded.iat * 1000) {
    throw new Error("Token revoked 🔴", {cause: 400})
  }

  const revoke_token = await get(revoked_token({userId: decoded.id, jti: decoded.jti}))
  if(revoke_token) {
    throw new Error("Token revoked 🔴❎", {cause: 400})
  }

  req.user = user;
  req.decoded = decoded

  next();
};
