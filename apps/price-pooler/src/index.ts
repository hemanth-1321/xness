import dotenv from "dotenv";
dotenv.config();
import WebSocket from "ws";
import {  redis } from "@repo/redis/redis-client";
import { Queue } from 'bullmq';
import { Trade } from "./types";

const binanceWS = process.env.BINANCE_API_KEY!;

const ws = new WebSocket(binanceWS);

ws.on("open", () => {
  console.log("connected to binance websocket");
});

ws.on("message", async (msg) => {
  try {
    // console.log("raw msg", JSON.parse(msg.toString()));
    const data: Trade = JSON.parse(msg.toString());

    if (data.stream && data.data) {
      //publishes data
      await publisher.publish("trade-channel", JSON.stringify(data));
      // console.log("data published", data);

      // trades are queued to push into data base (timescale db)
      const tradeQueue = new Queue('trade-queue', { connection: redis });
      await tradeQueue.add('trade', data);

      // console.log('data queued', data.data.p)
    }
  } catch (error) {
    console.error("error streaming binance api", error);
  }
});
