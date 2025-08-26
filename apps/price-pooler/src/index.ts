import WebSocket from "ws";
import client from "@repo/db/client"
import { publisher, subscriber } from "./redis-client";



async function Connection(){
  try {
    await client.connect()
    console.log("comnnected");
    
  } catch (error) {
    
    console.log("error",error)
  }
}

Connection()

const binanceWS =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";

const ws = new WebSocket(binanceWS);

ws.on("open", () => {
  console.log("Connected to Binance WebSocket");
});

ws.on("message", async (msg) => {
  try {
    const data = JSON.parse(msg.toString());
    if (data.stream && data.data) {
      await publisher.publish("stream-data", JSON.stringify(data));
    }
  } catch (err) {
    console.error("ws error", err);
  }
});


subscriber.subscribe("stream-data", (err, channel) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log(`Subscribed to ${channel} channel(s).`);
  }
});

subscriber.on("message", (channel, message) => {
  console.log("Received from Redis:", message);
});


ws.on("error", (err) => console.error("WebSocket error:", err));
