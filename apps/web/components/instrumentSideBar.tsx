// components/InstrumentSidebar.tsx
"use client";
import { useTrade } from "@/hooks/useTrades";
import { instruments } from "@/data/mockTradingData";
import InstrumentRow from "./InstrumentRow";

export const InstrumentSidebar = () => {
  useTrade(); // starts WS + batching

  return (
    <div className="w-64 bg-card border-r border-trading-border h-full flex flex-col">
      <div className="p-4 border-b border-trading-border">
        <h2 className="text-sm font-medium text-trading-text-primary mb-3">
          INSTRUMENTS
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {instruments.map((instrument) => (
          <InstrumentRow key={instrument.symbol} symbol={instrument.symbol} />
        ))}
      </div>
    </div>
  );
};
