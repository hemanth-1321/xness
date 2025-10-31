// worker.ts
import { redis } from "@repo/redis/redis-client";
import { Worker } from 'bullmq';
import client from "@repo/db/client";
import { Trade } from "./types";

const PRICE_MULTIPLIER = 1e8;
const VOLUME_MULTIPLIER = 1e6;

const worker = new Worker('trade-queue', async job => {
  const data: Trade = job.data;

  try {
    if (data.data?.E && data.data?.p && data.data?.q && data.data?.t) {
      const priceInt = Math.round(parseFloat(data.data.p) * PRICE_MULTIPLIER);
      const volumeInt = Math.round(parseFloat(data.data.q) * VOLUME_MULTIPLIER);

      const query = `INSERT INTO trades(time,symbol,price,volume,trade_id)
                     VALUES ($1,$2,$3,$4,$5)`;
      const values = [
        new Date(data.data.E).toISOString(),
        data.data.s,
        priceInt,
        volumeInt,
        data.data.t
      ];

      await client.query(query, values);
      console.log(`Inserted trade ${data.data.t} for symbol ${data.data.s}`);
    } else {
      console.warn("Skipped invalid trade:", data);
    }
  } catch (error) {
    console.error("Error processing trade:", error);
  }
}, { connection: redis });

worker.on('completed', (job) => {
  // console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`${job?.id} failed with ${err.message}`);
});

(async () => {
    try {
      await client.connect();
      console.log("Connected to DB");
    } catch (error) {
      console.error("DB connection error:", error);
      process.exit(1);
    }
  })();