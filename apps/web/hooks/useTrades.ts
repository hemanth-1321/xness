"use client"
import { useEffect } from "react";
import ws from "@/lib/ws";
import { useTrades } from "@/store/tradeStore";
import { instruments } from "@/data/mockTradingData";

export const useTrade = () => {
  const setPrice = useTrades((state) => state.setPrice);

  useEffect(() => {
    // Subscribe to all instruments
    instruments.forEach((instrument) => {
      ws.send(JSON.stringify({ type: "subscribe-trades", symbol: instrument.symbol }));
    });

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "live-trades") {
          const trade = msg.data;
          const symbol = trade?.s;
          const price = trade?.p ? parseFloat(trade.p) : undefined;
          const ask = trade?.ask ? parseFloat(trade.ask) : undefined;
          const volume = trade?.q ? parseFloat(trade.q) : undefined;

          if (symbol && price !== undefined) {
            setPrice(symbol, { price, ask, volume });
          }
        }
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [setPrice]);
};
