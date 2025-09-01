// store/tradeStore.ts
import { create } from "zustand";
import { instruments, TradingInstrument } from "@/data/mockTradingData";

interface TradingStore {
  prices: Record<string, TradingInstrument>;
  setPrice: (symbol: string, data: Partial<TradingInstrument>) => void;
}

export const useTrades = create<TradingStore>((set) => ({
  prices: instruments.reduce((acc, inst) => {
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
  }, {} as Record<string, TradingInstrument>),

  setPrice: (symbol, data) =>
    set((state: any) => {
      const prevPrice = state.prices[symbol]?.price ?? 0;
      const newPrice = data.price ?? prevPrice;
      const change = newPrice - prevPrice;
      const changePercent = prevPrice ? (change / prevPrice) * 100 : 0;
      const signal = change > 0 ? "buy" : change < 0 ? "sell" : "neutral";

      return {
        prices: {
          ...state.prices,
          [symbol]: {
            ...state.prices[symbol],
            ...data,
            change,
            changePercent,
            signal,
          },
        },
      };
    }),
}));
