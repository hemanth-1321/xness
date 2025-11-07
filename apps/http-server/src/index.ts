import Client from "@repo/db/client";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { subscriber } from "@repo/redis/redis-client";
import { Trade } from "./types/types";
import userAuthRoutes from "./routes/UserRoute";
import orderRoutes from "./routes/OrderRoutes";
import { checkOpenOrders } from "./controllers/OrderCOntroller";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

const server = createServer(app);
const wss = new WebSocketServer({ server });

const timeFramemap: Record<string, string> = {
  "1m": "candles_1m",
  "5m": "candles_5m",
  "10m": "candles_10m",
  "30m": "candles_30m",
  "1h": "candles_1h",
  "1d": "candles_1d",
};

app.get("/health", (_, res) => res.send("hello world"));

/**
 * GET end point to get candles based on time frame
 */

app.get("/candles/:timeframe", async (req, res) => {
  const { timeframe } = req.params;
  const { symbol, limit } = req.query;
  const viewName = timeFramemap[timeframe];

  if (!viewName) return res.status(400).json({ error: "Invalid timeframe" });

  try {
    const limitInt = limit ? Math.floor(Number(limit)) : 100;
    const result = await Client.query(
      `SELECT * FROM ${viewName} WHERE ($1::text IS NULL OR symbol = $1) ORDER BY bucket DESC LIMIT $2;`,
      [symbol || null, limitInt]
    );
    res.json(result.rows.reverse());
  } catch (err) {
    console.error("Error fetching candles:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.use("/api/v1/user", userAuthRoutes);
app.use("/api/v1/buy", orderRoutes);

/**
 * Websocket handling
 */

const subscriptions = new Map<string, Set<WebSocket>>();

wss.on("connection", (ws) => {
  console.log("client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("trade", data);

      if (data.type === "subscribe-trades") {
        const symbol = data.symbol.toUpperCase();
        const room = `trades-${symbol.toLowerCase()}`;
        if (!subscriptions.has(room)) {
          subscriptions.set(room, new Set());
        }
        subscriptions.get(room)!.add(ws);
        console.log(`client subscribed to ${room}`);
      }
    } catch (error) {
      console.error("invalid ws message", error);
    }
  });

  ws.on("close", () => {
    console.log("client disconnected");
    for (const clients of subscriptions.values()) {
      clients.delete(ws);
    }
  });
});

async function setRedis() {
  try {
    // Subscribe to channel (no need to call .connect() because Redis auto-connects)
    await subscriber.subscribe("trade-channel", (err, count) => {
      if (err) {
        console.error("Redis subscribe error:", err);
      } else {
        console.log(`Subscribed to ${count} channel(s).`);
      }
    });

    // Listen for messages
    subscriber.on("message", (channel, message) => {
      try {
        const data: Trade = JSON.parse(message);
        const trade = data.data;
        if (!trade) return;

        const symbol = trade.s.toLowerCase();
        const price = parseFloat(trade.p);
        const ask = (price * 1.01).toFixed(8);

        const room = `trades-${symbol}`;
        const clients = subscriptions.get(room);

        if (clients) {
          for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "live-trades",
                  data: { ...trade, ask },
                })
              );
            }
          }
        }

        checkOpenOrders({ symbol, price });
      } catch (err) {
        console.error("Error parsing Redis message:", err);
      }
    });

    console.log("Redis subscriber is ready and listening for messages.");
  } catch (err) {
    console.error("Error setting up Redis subscriber:", err);
  }
}

(async () => {
  try {
    // await Client.connect()
    // console.log("Connected to DB");
    server.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
    await setRedis();
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
})();
