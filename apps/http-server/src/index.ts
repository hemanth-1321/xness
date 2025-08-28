import client from "@repo/db/client"
import express from "express"

const app = express()
const PORT = 8080

const timeFramemap: Record<string, string> = {
  "1m": "candles_1m",
  "5m": "candles_5m",
  "10m": "candles_10m",
  "30m": "candles_30m",
  "1h": "candles_1h",
  "1d": "candles_1d",
}

app.get("/health", (_, res) => res.send("hello world"))

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
    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching candles:", err)
    res.status(500).json({ error: "Database query failed" })
  }
})

;(async () => {
  try {
    await client.connect()
    console.log("Connected to DB")
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
  } catch (err) {
    console.error("DB connection failed:", err)
    process.exit(1)
  }
})()
