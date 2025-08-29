"use client";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { mockInstruments, TradingInstrument } from "@/data/mockTradingData";

export const InstrumentSidebar = () => {

useEffect(() => {
  // Subscribe for each instrument
  mockInstruments.forEach((instrument) => {
    socket.emit("subscribe-trades", { symbol: instrument.symbol });
  });

  // Listen for live trades and log raw data first
  const handleLiveTrade = (trade: any) => {
    console.log("Received trade data:", trade); // <-- log everything first

    const symbol = trade?.data?.s; // e.g., "SOLUSDT"
    const price = parseFloat(trade?.data?.p);
    const ask = trade?.data?.ask ? parseFloat(trade.data.ask) : undefined;

    if (symbol && price) {
      setPrices((prev) => ({
        ...prev,
        [symbol]: {
          ...prev[symbol],
          price,
          ask,
          change: prev[symbol] ? price - prev[symbol].price : 0,
        },
      }));
    }
  };

  socket.on("live-trade", handleLiveTrade);

  return () => {
    socket.off("live-trade", handleLiveTrade);
  };
}, []);

  const [prices, setPrices] = useState<Record<string, TradingInstrument>>(
    () =>
      mockInstruments.reduce((acc, inst) => {
        acc[inst.symbol] = inst;
        return acc;
      }, {} as Record<string, TradingInstrument>)
  );

  useEffect(() => {
    // Subscribe for each instrument
    mockInstruments.forEach((instrument) => {
      socket.emit("subscribe-trades", { symbol: instrument.symbol });
    });

    // Listen for live trades
    socket.on("live-trade", (trade) => {
      const symbol = trade?.data?.s; // e.g., "SOLUSDT"
      const price = parseFloat(trade?.data?.p);
      const ask = parseFloat(trade?.data?.ask); // get ask price

      if (symbol && price) {
        setPrices((prev) => ({
          ...prev,
          [symbol]: {
            ...prev[symbol],
            price,
            ask,
            change: prev[symbol] ? price - prev[symbol].price : 0,
          },
        }));
      }
    });

    return () => {
      socket.off("live-trade");
    };
  }, []);

  return (
    <div className="w-64 bg-card border-r border-trading-border h-full flex flex-col">
      <div className="p-4 border-b border-trading-border">
        <h2 className="text-sm font-medium text-trading-text-primary mb-3">
          INSTRUMENTS
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.values(prices).map((instrument) => (
          <div
            key={instrument.id}
            className="px-4 py-3 hover:bg-trading-bg-tertiary cursor-pointer border-b border-trading-border/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-trading-text-primary">
                  {instrument.symbol}
                </div>
                <div className="text-xs text-trading-text-muted">
                  {instrument.name}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-trading-text-primary">
                 bid: {instrument.price.toFixed(2)}
                </div>
                {instrument.ask && (
                  <div className="text-sm font-medium text-trading-text-primary">
                    Ask: {instrument.ask.toFixed(2)}
                  </div>
                )}
               
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
