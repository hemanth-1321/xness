//to be removed

// import client from "@repo/db/client";
// import { subscriber } from "@repo/redis/redis-client";
// import { Trade } from "./types";

// const BATCH_SIZE = 1000;
// const PRICE_MULTIPLIER = 1e8;
// const VOLUME_MULTIPLIER = 1e6;

// let flushTimeout: NodeJS.Timeout | null = null;

// let tradeBuffer: Trade[] = [];

// async function insertTrade() {
//   try {
//     if (tradeBuffer.length == 0) return
//     const values: (string | number)[] = []
//     const placeholder: string[] = []

//     tradeBuffer.forEach((t, index) => {
//       const i = index * 5
//       placeholder.push(`($${i + 1},$${i + 2},$${i + 3},$${i + 4},$${i + 5})`)
//       const priceInt = Math.round(parseFloat(t.data.p) * PRICE_MULTIPLIER)
//       const volumeInt = Math.round(parseFloat(t.data.q) * VOLUME_MULTIPLIER)
//       values.push(
//         new Date(t.data.E).toISOString(),
//         t.data.s,
//         priceInt,
//         volumeInt,
//         t.data.t
//       )
//     })
//     const query = `INSERT INTO trades(time,symbol,price,volume,trade_id)
//     VALUES ${placeholder.join(",")}
//     `
//     try {
//       await client.query(query, values)
//       console.log(`Inserted ${tradeBuffer.length} trades in batch`);
//     } catch (error) {
//       console.error("batch insert error",error)
//     } finally {
//       tradeBuffer = []
//       if (flushTimeout) {
//         clearTimeout(flushTimeout)
//         flushTimeout = null
//       }
//     }

//   } catch (error) {
//     console.log("error inserting data", error);

//   }
// }

// async function consumeTrade() {
//   while (true) {
//     try {
//       const res = await subscriber.brpop("trade-queue", 0);
//       if (!res) continue;

//       const trade = res[1];
//       let data: Trade;
//       try {
//         data = JSON.parse(trade);
//       } catch (err) {
//         console.warn("Invalid JSON:", trade);
//         continue;
//       }

//       if (data.data?.E && data.data?.p && data.data?.q && data.data?.t) {
//         tradeBuffer.push(data);
//       } else {
//         console.warn("Skipped invalid trade:", data);
//         continue;
//       }

//       if (tradeBuffer.length === BATCH_SIZE) {
//         await insertTrade();
//       }
//     } catch (error) {
//       console.error("Error in consumeTrade:", error);
//     }
//   }
// }

// (async () => {
//   try {
//     await client.connect();
//     console.log("Connected to DB");
//     consumeTrade();
//   } catch (error) {
//     console.error("DB connection error:", error);
//     process.exit(1);
//   }
// })();
