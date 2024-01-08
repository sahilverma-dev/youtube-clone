import Redis from "ioredis";
import { REDIS_URI } from "../constants/env";

export const redis = new Redis(REDIS_URI);

export const connectRedis = async () => {
  try {
    await redis.connect();
    console.log(`REDIS: Redis connected at ${REDIS_URI}.`.green);
  } catch (error) {
    console.log("REDIS: Redis connection failed. ".red);
    console.log(error);

    process.exit(1);
  }
};
