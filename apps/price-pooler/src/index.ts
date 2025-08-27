import WebSocket from "ws";
import { publisher, subscriber } from "./redis-client";
import client from "@repo/db/client";

const binanceWS =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";

const ws = new WebSocket(binanceWS);


const testTrade: Trade = {
  stream: "btcusdt@trade",
  data: {
    e: "trade",
    E: Date.now(),
    s: "BTCUSDT",
    t: 1234567890,
    p: "30000.5",
    q: "0.001",
    T: Date.now().toString(),
  },
};

interface Trade {
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

const tradebuffer: Trade[] = [];
const FLUSH_INTERVAL_MS = 2000;
let uploading = false; // Move this to the top!

async function uploadBatch() {
  if (tradebuffer.length === 0) return;

  const batch = tradebuffer.splice(0, tradebuffer.length);

  try {
    const values: (string | number)[] = [];
    const placeholders: string[] = [];

    console.log(`Preparing to upload ${batch.length} trades:`);

    batch.forEach((trade, i) => {
      const idx = i * 5;
      placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`);
      values.push(
        new Date(trade.data.E).toISOString(),
        trade.data.s,
        parseFloat(trade.data.p),
        parseFloat(trade.data.q),
        Number(trade.data.t)
      );
    });

    const queryText = `
      INSERT INTO trades (time, symbol, price, volume, trade_id)
      VALUES ${placeholders.join(", ")}
    `;

    await client.query(queryText, values);
    console.log(`Inserted ${batch.length} trades into the database.`);
  } catch (error) {
    console.error("Batch insert error:", error);
  }
}

setInterval(async () => {
  if (!uploading && tradebuffer.length > 0) {
    uploading = true;
    console.log(`Flushing ${tradebuffer.length} trades...`);
    await uploadBatch();
    uploading = false;
    console.log("Flushing completed");
  }
}, FLUSH_INTERVAL_MS);

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

subscriber.on("message", async (channel, message) => {
  try {
    const trade = JSON.parse(message);
    tradebuffer.push(trade);
  } catch (error) {
    console.log("failed to parse trade data", error);
  }
});

ws.on("error", (err) => console.error("WebSocket error:", err));