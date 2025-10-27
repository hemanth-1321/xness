"use client";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Slider } from "@workspace/ui/components/slider";
import { useTradingStore } from "@/store/useTradingStore";
import { useTrades } from "@/store/tradeStore";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { useOpenOrders } from "@/store/useOpenOrders";

const DECIMALS: Record<string, number> = {
  BTCUSDT: 2,
  ETHUSDT: 2,
  SOLUSDT: 4,
  XRPUSDT: 4,
  DOGEUSDT: 4,
  SUIUSDT: 5,
  QSETUSDT: 5,
};

const LEVERAGE_OPTIONS = [1, 2, 5, 10];

const formatPrice = (price?: number, symbol?: string) => {
  if (price == null || Number.isNaN(price)) return "--";
  const decimals = (symbol && DECIMALS[symbol.toUpperCase()]) ?? 5;
  return price.toFixed(Number(decimals));
};

export const OrderPanel = () => {
  const [orderType, setOrderType] = useState<"market" | "pending">("market");
  const [volume, setVolume] = useState("0.0"); // lots
  const [amount, setAmount] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"buy" | "sell" | null>(null);

  const { token } = useUserStore();
  const { prices } = useTrades();
  const { symbol } = useTradingStore();
  const { fetchOpenOrders } = useOpenOrders();

  const current = (symbol && prices?.[symbol]) || undefined;
  const buyPrice = current?.ask ?? current?.price ?? undefined;
  const sellPrice = current?.price ?? current?.price ?? undefined;

  // Effective leveraged position
  const effectivePosition = Number(amount) * leverage;

  const handleVolumeChange = (vol: string) => {
    setVolume(vol);
    if (buyPrice) {
      const numericVol = Number(vol) || 0;
      const computedAmount = numericVol * buyPrice; // convert to USD
      setAmount(computedAmount);
    }
  };

  const handleAmountChange = (val: string) => {
    const numericVal = Number(val) || 0;
    setAmount(numericVal);

    // Update volume from amount
    if (buyPrice && numericVal > 0) {
      setVolume((numericVal / buyPrice).toFixed(6));
    }
  };

  const handleOpenOrder = async () => {
    if (!symbol) {
      toast.error("Missing symbol or price");
      return;
    }
    if (!selected) {
      toast.error("Please select Buy or Sell");
      return;
    }
    if (Number(amount) <= 0 || Number(volume) <= 0) {
      toast.error("Amount and volume must be greater than 0");
      return;
    }


    setLoading(true);

    const orderData = {
      asset: symbol,
      type: selected.toUpperCase(), // "BUY" or "SELL"
      quantity: Number(volume),       // lots
      userAmount: Number(amount),       // USD
      openingPrice: selected === "buy" ? buyPrice : sellPrice,
      leverage,
    };

    try {
      console.log("Sending order:", `${BACKEND_URL}/trade`, orderData);

      const res = await axios.post(`${BACKEND_URL}/buy/trade`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success(`${selected.toUpperCase()} order placed successfully`);
        await fetchOpenOrders();
      }
    } catch (error: any) {
      console.error("Error creating order:", error.response ?? error.message);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 bg-card border-l border-trading-border p-4 flex flex-col mr-10">
      {/* Symbol Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-trading-text-primary mb-2">
          {symbol ?? "—"}
        </h3>

        <div className="flex items-center gap-2 p-4 rounded-xl text-white w-fit">
          {/* Sell box */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelected("sell")}
            className={`flex flex-col items-center justify-center px-6 py-3 rounded-lg border-2 cursor-pointer transition
              ${selected === "sell"
                ? "bg-red-600 border-red-500 text-white"
                : "border-red-500 bg-black text-red-400 hover:bg-red-600 hover:text-white"
              }`}
          >
            <span className="text-sm font-medium">Short</span>
            <span className="text-lg font-bold">{formatPrice(sellPrice, symbol)}</span>
          </div>

          {/* Buy box */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelected("buy")}
            className={`flex flex-col items-center justify-center px-6 py-3 rounded-lg border-2 cursor-pointer transition
              ${selected === "buy"
                ? "bg-blue-600 border-blue-500 text-white"
                : "border-blue-500 bg-black text-blue-400 hover:bg-blue-600 hover:text-white"
              }`}
          >
            <span className="text-sm font-medium">Long</span>
            <span className="text-lg font-bold">{formatPrice(buyPrice, symbol)}</span>
          </div>
        </div>
      </div>


      {/* Volume + Amount + Leverage */}
      <div className="space-y-4 flex-1">
        {/* Volume input */}
        <div className="space-y-2">
          <Label htmlFor="volume" className="text-sm text-trading-text-secondary">
            Volume (lots)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="volume"
              value={volume}
              onChange={(e) => handleVolumeChange(e.target.value)}
              className="bg-trading-bg-tertiary border-trading-border text-trading-text-primary"
            />
            <span className="text-sm text-trading-text-muted">{symbol}</span>
          </div>
        </div>

        {/* Amount input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm text-trading-text-secondary">
            Amount to invest (USD)
          </Label>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="bg-trading-bg-tertiary border-trading-border text-trading-text-primary"
          />
        </div>

        {/* Effective position */}
        <p className="text-xs text-trading-text-muted mt-1">
          Effective position: {effectivePosition.toFixed(2)} USD
        </p>

        {/* Leverage slider */}
        <div className="space-y-2">
          <Label htmlFor="leverage" className="text-sm text-trading-text-secondary">
            Leverage ({leverage}x)
          </Label>
          <Slider
            value={[LEVERAGE_OPTIONS.indexOf(leverage)]}
            min={0}
            max={LEVERAGE_OPTIONS.length - 1}
            step={1}
            onValueChange={(val) => {
              const index = val[0] ?? 0;
              setLeverage(LEVERAGE_OPTIONS[index]!);
            }}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-trading-text-muted mt-1">
            {LEVERAGE_OPTIONS.map((l) => (
              <span key={l}>{l}x</span>
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <Button
          onClick={handleOpenOrder}
          className="w-full justify-center font-semibold py-3 text-white transition bg-blue-600 hover:bg-blue-700 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Placing..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
};
