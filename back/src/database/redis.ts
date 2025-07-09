import { createClient } from "redis";
import { REDIS_URL } from "../config/env";

export const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connection successful.");
  } catch (error) {
    console.error("Redis connection failed:", error);
    process.exit(1);
  }
}
