import client from "@repo/db/client"
import express from "express"
import cors from "cors"
import{createServer} from 'http'
import {Server} from 'socket.io'
import{subscriber}from '@repo/redis/redis-client'

const app = express()
app.use(cors())
const PORT = 8080

const server =createServer(app)
const io=new Server(server,{
  cors:{
    origin:"*"
  }
})

const timeFramemap: Record<string, string> = {
  "1m": "candles_1m",
  "5m": "candles_5m",
  "10m": "candles_10m",
  "30m": "candles_30m",
  "1h": "candles_1h",
  "1d": "candles_1d",
}

app.get("/health", (_, res) => res.send("hello world"))

/**
 * GET end point to get candles based on time frame
 */

app.get("/candles/:timeframe", async (req, res) => {
  const { timeframe } = req.params
  const { symbol, limit } = req.query
  const viewName = timeFramemap[timeframe]

  if (!viewName) return res.status(400).json({ error: "Invalid timeframe" })

  try {
    const limitInt = limit ? Math.floor(Number(limit)) : 100
    const result = await client.query(
      `SELECT * FROM ${viewName} WHERE ($1::text IS NULL OR symbol = $1) ORDER BY bucket DESC LIMIT $2;`,
      [symbol || null, limitInt]
    )
   res.json(result.rows.reverse())
  } catch (err) {
    console.error("Error fetching candles:", err)
    res.status(500).json({ error: "Database query failed" })
  }
})


/**
 * socket io and subscribe
 */

io.on("connection",(socket)=>{
console.log("client connected",socket.id);

  socket.on("subscribe-trades", async (data:{symbol:string}) => {
    const {symbol}=data
    const room = `trades-${symbol}`;
    await socket.join(room);
    console.log(`Client subscribed to room: ${room}`);
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });


})


async function setRedis() {
  if (subscriber.status !== "ready") {
    await subscriber.connect();
    console.log("Redis subscriber connected");
  }

  await subscriber.subscribe("trade-channel"); // just subscribe

  subscriber.on("message", (channel, message) => {
    console.log("Raw Redis message:", message);

    if (!message || typeof message !== "string") {
      console.error("Received non-string message:", message);
      return;
    }

    try {
      const data = JSON.parse(message);
      const symbol = data.trade?.data?.s;
      if (symbol) {
        const room = `trades-${symbol}`;
        io.to(room).emit("live-trade", data.trade);
        console.log(`Emitted trade to ${room}:`, data.trade);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });
}




;(async () => {
  try {
    await client.connect()
    console.log("Connected to DB")
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
    await setRedis()
  } catch (err) {
    console.error("DB connection failed:", err)
    process.exit(1)
  }
})()
