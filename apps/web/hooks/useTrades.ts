"use client";
import { useEffect, useState } from "react";
import ws from "@/lib/ws";
import { instruments, TradingInstrument } from "@/data/mockTradingData";

export const useTrades = () => {
  const [prices, setPrices] = useState<Record<string, TradingInstrument>>(
    () =>
      instruments.reduce((acc, inst) => {
        acc[inst.symbol] = {
          ...inst,
          price: 0,
          change: 0,
          changePercent: 0,
          signal: "neutral",
          volume: 0,
          ask: undefined,
        };
        return acc;
      }, {} as Record<string, TradingInstrument>)
  );

  useEffect(() => {
    // subscribe to all instruments
    instruments.forEach((instrument) => {
      ws.send(JSON.stringify({ type: "subscribe-trades", symbol: instrument.symbol }));
    });

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "live-trades") {
          const trade = msg.data;
          const symbol = trade?.s; // "BTCUSDT"
          const price = parseFloat(trade?.p);
          const ask = trade?.ask ? parseFloat(trade.ask) : undefined;
          const volume = trade?.q ? parseFloat(trade.q) : 0;

          if (symbol && price) {
            setPrices((prev) => {
              const prevPrice = prev[symbol]?.price ?? price;
              const change = price - prevPrice;
              const changePercent = prevPrice ? (change / prevPrice) * 100 : 0;

              return {
                ...prev,
                [symbol]: {
                  ...prev[symbol],
                  price,
                  ask,
                  volume,
                  change,
                  changePercent,
                  signal:
                    change > 0 ? "buy" : change < 0 ? "sell" : "neutral",
                },
              };
            });
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
  }, []);

  return prices;
};
