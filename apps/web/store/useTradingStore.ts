import { create } from "zustand";

interface TradingStore {
  symbol: string;
  setSymbol: (s: string) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  symbol: "BTCUSDT",
  setSymbol: (symbol) => set({ symbol }),
  timeframe: "5m",
  setTimeframe: (timeframe) => set({ timeframe }),
}));
