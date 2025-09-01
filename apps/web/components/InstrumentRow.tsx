"use client";
import { useTrades } from "@/store/tradeStore";

const InstrumentRow = ({ symbol }: { symbol: string }) => {
  const instrument = useTrades((state) => state.prices[symbol]);

  if (!instrument) return null;

  return (
    <div
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
            {instrument.change.toFixed(2)} (
            {instrument.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentRow;
