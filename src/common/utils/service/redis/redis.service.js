import { EmailEnum } from "../../../enum/email.enum.js";
import { redisClient } from "./redis.connect.js";

export const otp_key = ({userEmail,type = EmailEnum.confirmEmail}) => {
    return `otp::${userEmail}::${type}`
}

export const blocked_otp_key = ({email, type = EmailEnum.confirmEmail}) => {
    return `${otp_key({userEmail:email, type})}::blocked`
}

export const max_otp_key = ({email, type = EmailEnum.confirmEmail}) => {
    return `${otp_key({userEmail:email, type})}::max_tries`
}

export const revoked_token = ({userId,jti}) => {
    return `${userId}::${jti}::token_revoked`
}

export const get_key = (userId) => userId;

export const userProfile = (userId) => {
    return `${userId}::profile`
}

export const setValue = async ({ key, value, ttl }) => {
  try {
    const data = typeof value == "string" ? value : JSON.stringify(value);
    return ttl
      ? await redisClient.set(key, data, { EX: ttl })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log(`Fail to set value in redis ❎`, error);
  }
};

export const get = async (key) => {
    try {
        try {
            return JSON.parse(await redisClient.get(key))
        } catch (error) {
            return await redisClient.get(key)
        }
    } catch (error) {
        console.log(`Failed to get ${key} from redis ❎`, error);
    }
}

export const updateKey = async ({key,value,ttl}) => {
    try {
        if(!await redisClient.exists(key)) {
            return 0
        }
        return await setValue({key,value,ttl})
    } catch (error) {
        console.log("Failed to update this key in redis ❎", error);
    }
}

export const keyTTL = async (key) => {
    try {
        return await redisClient.ttl(key)
    } catch (error) {
        console.log("Failed to get this key ttl ❎", error);
    }
}

export const keyExists = async (key) => {
    try {
        return await redisClient.exists(key)
    } catch (error) {
        console.log("Failed to check this key existance ❎", error);
    }
}

export const deleteKey = async (key) => {
  try {
    if (!key || key.length === 0) return 0;

    if (Array.isArray(key)) {
      return await redisClient.del(...key);
    }

    return await redisClient.del(key);
  } catch (error) {
    console.log("Failed to delete this key from redis ❎", error);
  }
};

export const increaseKey = async (key) => {
    try {
        if(!key.length) return 0
        return await redisClient.incr(key)
    } catch (error) {
        console.log("Failed to increase this key in redis ❎", error);
    }
}

export const keys = async (pattern) => {
    try {
        return await redisClient.keys(`${pattern}*`)
    } catch (error) {
        console.log("Failed to get keys from redis ❎", error);
    }
}