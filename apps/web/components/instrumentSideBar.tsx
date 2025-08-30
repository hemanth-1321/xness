"use client";
import { useTrades } from "@/hooks/useTrades";

export const InstrumentSidebar = () => {
  const prices = useTrades();

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
                  Bid: {instrument.price.toFixed(2)}
                </div>
                {instrument.ask && (
                  <div className="text-sm font-medium text-trading-text-primary">
                    Ask: {instrument.ask.toFixed(2)}
                  </div>
                )}
                <div
                  className={`text-xs ${
                    instrument.signal === "buy"
                      ? "text-green-500"
                      : instrument.signal === "sell"
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {instrument.change.toFixed(2)} ({instrument.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
