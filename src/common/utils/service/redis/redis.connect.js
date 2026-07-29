import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const redisConnection = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log(`Redis connected successfully ✅`);
    })
    .catch((error) => {
      console.log(`Failed to connect redis ❎`, error);
    });
};
