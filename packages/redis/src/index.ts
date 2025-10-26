import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;
export const publisher = new Redis(REDIS_URL!);
publisher.on("connect", () => console.log("Publisher connected"));

export const subscriber = new Redis(REDIS_URL!);
subscriber.on("connect", () => console.log("Subscriber connected"));
