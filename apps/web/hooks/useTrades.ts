// hooks/useTrades.ts
"use client";
import { useEffect } from "react";
import ws from "@/lib/ws";
import { useTrades } from "@/store/tradeStore";
import { instruments } from "@/data/mockTradingData";

export const useTrade = () => {
  const setPrice = useTrades((state) => state.setPrice);

  useEffect(() => {
    // subscribe to all instruments
    instruments.forEach((instrument) => {
      ws.send(
        JSON.stringify({ type: "subscribe-trades", symbol: instrument.symbol })
      );
    });

    // buffer for batching
    const buffer: Record<string, any> = {};

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "live-trades") {
          const trade = msg.data;
          const symbol = trade?.s;
          if (!symbol) return;

          buffer[symbol] = {
            price: trade?.p ? parseFloat(trade.p) : undefined,
            ask: trade?.ask ? parseFloat(trade.ask) : undefined,
            volume: trade?.q ? parseFloat(trade.q) : undefined,
          };
        }
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };

    ws.addEventListener("message", handleMessage);

    // flush buffer every 100ms
    const interval = setInterval(() => {
      Object.entries(buffer).forEach(([symbol, data]) => {
        setPrice(symbol, data);
      });
      for (const k in buffer) delete buffer[k];
    }, 100);

    return () => {
      ws.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [setPrice]);
};
