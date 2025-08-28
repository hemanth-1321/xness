import { Search } from 'lucide-react';
import { mockInstruments, TradingInstrument } from '@/data/mockTradingData'
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';

export const InstrumentSidebar = () => {
  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'BTC') return price.toLocaleString();
    if (symbol.includes('USD') || symbol === 'XAU/USD') return price.toFixed(3);
    return price.toFixed(2);
  };

  const formatChange = (change: number, symbol: string) => {
    const sign = change >= 0 ? '+' : '';
    if (symbol === 'BTC') return `${sign}${change.toFixed(0)}`;
    if (symbol.includes('USD') || symbol === 'XAU/USD') return `${sign}${change.toFixed(3)}`;
    return `${sign}${change.toFixed(2)}`;
  };

  return (
    <div className="w-64 bg-card border-r border-trading-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-trading-border">
        <h2 className="text-sm font-medium text-trading-text-primary mb-3">INSTRUMENTS</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-trading-text-muted" />
          <Input
            placeholder="Search"
            className="pl-10 bg-trading-bg-tertiary border-trading-border text-trading-text-primary placeholder:text-trading-text-muted"
          />
        </div>
      </div>

      {/* Favorites section */}
      <div className="p-4 border-b border-trading-border">
        <h3 className="text-xs font-medium text-trading-text-secondary mb-3">Favorites</h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-trading-text-muted">
            <span>Symbol</span>
            <div className="flex gap-8">
              <span>Signal</span>
              <span>Bid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruments list */}
      <div className="flex-1 overflow-y-auto">
        {mockInstruments.map((instrument) => (
          <div
            key={instrument.id}
            className="px-4 py-3 hover:bg-trading-bg-tertiary cursor-pointer border-b border-trading-border/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-trading-text-primary">
                    {instrument.symbol}
                  </span>
                  <span className="text-xs text-trading-text-muted truncate max-w-[100px]">
                    {instrument.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 ${
                    instrument.signal === 'buy' 
                      ? 'bg-trading-success-bg text-trading-success border-trading-success/20' 
                      : instrument.signal === 'sell'
                      ? 'bg-trading-danger-bg text-trading-danger border-trading-danger/20'
                      : 'bg-trading-bg-tertiary text-trading-text-muted border-trading-border'
                  }`}
                >
                  {instrument.signal === 'buy' ? '↗' : instrument.signal === 'sell' ? '↘' : '•'}
                </Badge>

                <div className="text-right">
                  <div className="text-sm font-medium text-trading-text-primary">
                    {formatPrice(instrument.price, instrument.symbol)}
                  </div>
                  <div className={`text-xs ${
                    instrument.change >= 0 ? 'text-trading-success' : 'text-trading-danger'
                  }`}>
                    {formatChange(instrument.change, instrument.symbol)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};