import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("Connected to server");

  // Subscribe to XRP trades
  ws.send(JSON.stringify({
    type: "subscribe-trades",
    symbol: "XRPUSDT"
  }));
});

ws.on("message", (msg) => {
  console.log("Received:", msg.toString());
});

ws.on("close", () => console.log("Disconnected"));
ws.on("error", (err) => console.error("Error:", err));
