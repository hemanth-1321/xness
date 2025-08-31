"use client";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { useTradingStore } from "@/store/useTradingStore";
import { useTrades } from "@/store/tradeStore";

/**
 * Decimals map per-symbol (adjust as needed).
 * Add your other symbols here (QSET, XRP, DOGE, SUI, ...).
 */
const DECIMALS: Record<string, number> = {
  BTCUSDT: 2,
  ETHUSDT: 2,
  SOLUSDT: 4,
  XRPUSDT: 4,
  DOGEUSDT: 4,
  SUIUSDT: 5,
  QSETUSDT: 5,
};

const formatPrice = (price?: number, symbol?: string) => {
  if (price == null || Number.isNaN(price)) return "--";
  const decimals = (symbol && DECIMALS[symbol.toUpperCase()]) ?? 5;
  return price.toFixed(decimals);
};

export const OrderPanel = () => {
  const [orderType, setOrderType] = useState<"market" | "pending">("market");
  const [volume, setVolume] = useState("0.01");

  const { prices } = useTrades(); // prices is a map of symbol -> price object
  const { symbol } = useTradingStore(); // selected symbol, e.g. "BTCUSDT"

  // current price object for selected symbol (may be undefined initially)
  const current = (symbol && prices?.[symbol]) || undefined;

  // Decide which fields map to Buy / Sell
  // - Buy: `ask` (what you pay to buy)
  // - Sell: `bid` (what you receive when you sell). If bid missing, fall back to `price` (last trade)
  const buyPrice = current?.ask ?? current?.price ?? undefined;
  const sellPrice = current?.bid ?? current?.price ?? undefined;

  return (
    <div className="w-80 bg-card border-l border-trading-border p-4 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-trading-text-primary mb-2">
          {symbol ?? "—"}
        </h3>

        <div className="flex items-center gap-2 bg-black p-4 rounded-xl text-white w-fit">
          {/* Sell box */}
          <div
            role="button"
            tabIndex={0}
            className="flex flex-col items-center justify-center px-6 py-3 rounded-lg border-2 border-red-500 bg-black text-red-400 hover:bg-red-600 hover:text-white cursor-pointer transition"
          >
            <span className="text-sm font-medium">Sell</span>
            <span className="text-lg font-bold">
              {formatPrice(sellPrice, symbol)}
            </span>
          </div>

          {/* Buy box */}
          <div
            role="button"
            tabIndex={0}
            className="flex flex-col items-center justify-center px-6 py-3 rounded-lg border-2 border-blue-500 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition"
          >
            <span className="text-sm font-medium">Buy</span>
            <span className="text-lg font-bold">
              {formatPrice(buyPrice, symbol)}
            </span>
          </div>
        </div>
      </div>

      <Tabs
        value={orderType}
        onValueChange={(value) => setOrderType(value as any)}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-2 bg-trading-bg-tertiary">
          <TabsTrigger value="market" className="data-[state=active]:bg-trading-info">
            Market
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-trading-info">
            Pending
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <Label htmlFor="volume" className="text-sm text-trading-text-secondary">
            Volume
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="volume"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="bg-trading-bg-tertiary border-trading-border text-trading-text-primary"
            />
            <span className="text-sm text-trading-text-muted">Lots</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6">
        <Button className="bg-trading-success hover:bg-trading-success/90 text-white font-semibold py-3">
          Buy {formatPrice(buyPrice, symbol)}
        </Button>
        <Button className="bg-trading-danger hover:bg-trading-danger/90 text-white font-semibold py-3">
          Sell {formatPrice(sellPrice, symbol)}
        </Button>
      </div>
    </div>
  );
};
