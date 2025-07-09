import dotenv from "dotenv";

dotenv.config();

export const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
