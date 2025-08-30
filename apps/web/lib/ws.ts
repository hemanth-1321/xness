// client.ts

const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Connected to server");
  ws.send(JSON.stringify({
    type: "subscribe-trades",
    symbol: "XRPUSDT"
  }));
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};

ws.onclose = () => console.log("Disconnected");
ws.onerror = (err) => console.error("Error:", err);

export default ws;
