"use client";
import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Badge } from '@workspace/ui/components/badge';
import { getCandleDataBySymbol } from '@/data/mockTradingData';

export const OrderPanel = () => {
  const [orderType, setOrderType] = useState<'market' | 'pending'>('market');
  const [volume, setVolume] = useState('0.01');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [selectedSymbol] = useState('BTCUSDT'); // This would be passed from parent in real app

  // Get current price data for selected symbol
  const getCurrentPrice = () => {
    const symbolData = getCandleDataBySymbol(selectedSymbol);
    if (symbolData.length > 0) {
      const latestCandle = symbolData[symbolData.length - 1];
      if (latestCandle && typeof latestCandle.close === 'number') {
        return {
          bid: latestCandle.close - 0.01,
          ask: latestCandle.close + 0.01,
          current: latestCandle.close
        };
      }
    }
    return { bid: 112790.55, ask: 112790.57, current: 112790.56 }; // fallback
  };

  const priceData = getCurrentPrice();

  const formatPrice = (price: number) => {
    if (selectedSymbol === 'BTCUSDT') return price.toFixed(2);
    if (selectedSymbol === 'ETHUSDT') return price.toFixed(2);
    if (selectedSymbol === 'SOLUSDT') return price.toFixed(2);
    return price.toFixed(5);
  };

  return (
    <div className="w-80 bg-card border-l border-trading-border p-4 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-trading-text-primary mb-2">{selectedSymbol}</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-right">
            <div className="text-sm text-trading-text-muted">Regular form</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-trading-text-primary">
                {formatPrice(priceData.current)}
              </span>
              <Badge className="bg-trading-danger text-white text-xs">
                -{Math.abs(priceData.current - priceData.ask).toFixed(2)}
              </Badge>
            </div>
            <div className="text-sm text-trading-danger">
              {formatPrice(priceData.current - priceData.ask)} USD
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-trading-text-muted">Market</div>
            <div className="text-sm text-trading-text-muted">Pending</div>
            <div className="text-sm text-trading-text-muted">Volume</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-trading-success">{formatPrice(priceData.ask)}</span>
              <div className="text-xs text-trading-text-muted">
                <div>76%</div>
                <div>24%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)} className="mb-4">
        <TabsList className="grid w-full grid-cols-2 bg-trading-bg-tertiary">
          <TabsTrigger value="market" className="data-[state=active]:bg-trading-info">Market</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-trading-info">Pending</TabsTrigger>
        </TabsList>
      </Tabs>

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
            <Button 
              variant="ghost" 
              size="sm"
              className="text-trading-text-muted hover:text-trading-text-primary px-2"
            >
              +
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="takeprofit" className="text-sm text-trading-text-secondary">Take Profit</Label>
          <div className="flex items-center gap-2">
            <Input
              id="takeprofit"
              placeholder="Not set"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="bg-trading-bg-tertiary border-trading-border text-trading-text-primary placeholder:text-trading-text-muted"
            />
            <span className="text-sm text-trading-text-muted">Price</span>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-trading-text-muted hover:text-trading-text-primary px-2"
            >
              ↗
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stoploss" className="text-sm text-trading-text-secondary">Stop Loss</Label>
          <div className="flex items-center gap-2">
            <Input
              id="stoploss"
              placeholder="Not set"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="bg-trading-bg-tertiary border-trading-border text-trading-text-primary placeholder:text-trading-text-muted"
            />
            <span className="text-sm text-trading-text-muted">Price</span>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-trading-text-muted hover:text-trading-text-primary px-2"
            >
              ↘
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6">
        <Button 
          className="bg-trading-success hover:bg-trading-success/90 text-white font-semibold py-3"
        >
          Buy {formatPrice(priceData.ask)}
        </Button>
        <Button 
          className="bg-trading-danger hover:bg-trading-danger/90 text-white font-semibold py-3"
        >
          Sell {formatPrice(priceData.bid)}
        </Button>
      </div>
    </div>
  );
};