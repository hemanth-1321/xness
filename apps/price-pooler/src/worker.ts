import client from "@repo/db/client";
import { subscriber } from "@repo/redis/redis-client";

const BATCH_SIZE = 1000;
const BATCH_DELAY = 3000;

interface BinanceTrade {
  e: string;   // event type
  E: number;   // event time
  s: string;   // symbol
  t: number;   // trade ID
  p: string;   // price
  q: string;   // quantity
}

interface TradeWrapper {
  stream?: string;
  data: BinanceTrade;
}

let tradeBuffer: BinanceTrade[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

async function flushTrades() {
  if (tradeBuffer.length === 0) return;

  const values: any[] = [];
  const placeholders: string[] = [];

  tradeBuffer.forEach((t, index) => {
    const i = index * 5;
    placeholders.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5})`);
    values.push(
      new Date(t.E).toISOString(),
      t.s,
      parseFloat(t.p),
      parseFloat(t.q),
      Number(t.t)
    );
  });

  const queryText = `
    INSERT INTO trades (time, symbol, price, volume, trade_id)
    VALUES ${placeholders.join(",")}
  `;

  try {
    await client.query(queryText, values);
    console.log(`✅ Inserted ${tradeBuffer.length} trades in batch`);
  } catch (err) {
    console.error("❌ Batch insert error:", err);
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
      const raw = JSON.parse(message) as TradeWrapper | BinanceTrade;

      // Normalize: ensure we always get BinanceTrade shape
      const trade: BinanceTrade = "data" in raw ? raw.data : raw;

      if (trade?.E && trade?.s && trade?.p && trade?.q && trade?.t !== undefined) {
        tradeBuffer.push(trade);
      } else {
        console.warn("⚠️ Skipped invalid trade:", raw);
        continue;
      }

      if (tradeBuffer.length >= BATCH_SIZE) {
        await flushTrades();
      } else if (!flushTimeout) {
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
    console.log("Connected to DB");
    consumeTrades();
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
})();
