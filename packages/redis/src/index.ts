import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// Connection string
const REDIS_URL = process.env.REDIS_URL;

export const publisher = new Redis(REDIS_URL!)

publisher.on("connect", () => console.log("Publisher connected"));

export const subscriber = new Redis(REDIS_URL!)
export const redis = new Redis(REDIS_URL!)
subscriber.on("connect", () => console.log("Subscriber connected"));
