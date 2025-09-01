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
import { useOrderStore } from "@/store/useOrderStore";
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
  const [volume, setVolume] = useState("0.01");
  const [leverage, setLeverage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"buy" | "sell" | null>(null);

  const { token } = useUserStore();
  const { prices } = useTrades();
  const { symbol } = useTradingStore();
  const{fetchOpenOrders}=useOpenOrders()
  const current = (symbol && prices?.[symbol]) || undefined;
  const buyPrice = current?.ask ?? current?.price ?? undefined;
  const sellPrice = current?.price ?? current?.price ?? undefined;

const handleOpenOrder = async () => {

  if (!symbol) {
    toast.error("Missing symbol or price");
    return;
  }

  setLoading(true);

  const orderData = {
    asset: symbol,
    quantity: Number(volume),
    openingPrice: buyPrice,
    leverage,
  };

  try {
    console.log("Sending buy order:", `${BACKEND_URL}/buy/trade`, orderData);

    const res = await axios.post(`${BACKEND_URL}/buy/trade`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      toast("Buy order placed successfully");
      await fetchOpenOrders()
    }
  } catch (error: any) {
    console.error("Error creating buy order:", error.response ?? error.message);
    toast.error(error.response?.data?.message || "Failed to place buy order");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-80 bg-card border-l border-trading-border p-4 flex flex-col mr-10">
      {/* Symbol Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-trading-text-primary mb-2">{symbol ?? "—"}</h3>

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
            <span className="text-sm font-medium">Sell</span>
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
            <span className="text-sm font-medium">Buy</span>
            <span className="text-lg font-bold">{formatPrice(buyPrice, symbol)}</span>
          </div>
        </div>
      </div>

      {/* Order type tabs */}
      <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)} className="mb-4">
        <TabsList className="grid w-full grid-cols-2 bg-trading-bg-tertiary">
          <TabsTrigger value="market" className="data-[state=active]:bg-trading-info">Market</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-trading-info">Pending</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Volume + Leverage */}
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <Label htmlFor="volume" className="text-sm text-trading-text-secondary">Volume</Label>
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

        <div className="space-y-2">
          <Label htmlFor="leverage" className="text-sm text-trading-text-secondary">
            Leverage ({leverage}x)
          </Label>
          <Slider
            value={[LEVERAGE_OPTIONS.indexOf(leverage) >= 0 ? LEVERAGE_OPTIONS.indexOf(leverage) : 0]}
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
