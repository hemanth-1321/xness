import client from "@repo/db/client";
import { Trade } from ".";
import { subscriber } from "./redis-client";

const BATCH_SIZE = 1000;       // flush if buffer reaches 100 trades
const BATCH_DELAY = 3000;     // flush if 3 seconds pass

let tradeBuffer: Trade[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

async function flushTrades() {
  if (tradeBuffer.length === 0) return;

  const values: any[] = [];
  const placeholders: string[] = [];

  tradeBuffer.forEach((trade, index) => {
    const i = index * 5;
    placeholders.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5})`);
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
    VALUES ${placeholders.join(",")}
  `;

  try {
    await client.query(queryText, values);
    console.log(`Inserted ${tradeBuffer.length} trades in batch`);
  } catch (err) {
    console.error("Batch insert error:", err);
  } finally {
    tradeBuffer = [];
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
  }
}

async function consumeTrades() {
  while (true) {
    try {
      const res = await subscriber.brpop("trade-queue", 0);
      if (!res) continue;

      const [, message] = res;
      const trade: Trade = JSON.parse(message);

      tradeBuffer.push(trade);
    //   console.log(`Buffered trade: ${trade.data.s} @ ${trade.data.p} qty ${trade.data.q}`);
    //   console.log(`Current buffer size: ${tradeBuffer.length}`);

      // Flush if buffer reached batch size
      if (tradeBuffer.length >= BATCH_SIZE) {
        await flushTrades();
      } else if (!flushTimeout) {
        // Otherwise, set a delay to flush
        flushTimeout = setTimeout(flushTrades, BATCH_DELAY);
      }

    } catch (err) {
      console.error("Error in consumeTrades:", err);
    }
  }
}

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected to DB");
    consumeTrades();
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
})();
