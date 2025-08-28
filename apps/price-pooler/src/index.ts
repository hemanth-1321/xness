import WebSocket from "ws";
import { publisher } from"@repo/redis/redis-client"


const binanceWS =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";

const ws = new WebSocket(binanceWS);

export interface Trade {
  stream: string;
  data: {
    e: string;
    E: number;
    s: string;
    t: number;
    p: string;
    q: string;
    T: string;
  };
}
/**
 * Producer:push trades to queue
 */

ws.on("open", () => {
  console.log("Connected to Binance WebSocket");
});

ws.on("message", async (msg) => {
  try {
    const data = JSON.parse(msg.toString());
    if (data.stream && data.data) {
      await publisher.publish("trade-channel",JSON.stringify({
          price: data.data.p,
      }))
      await publisher.rpush("trade-queue", JSON.stringify(data));
      console.log(`Queued trade: ${data.data.s} @ ${data.data.p}`);
    }
  } catch (err) {
    console.error("ws error", err);
  }
});

ws.on("error", (err) => console.error("WebSocket error:", err));

