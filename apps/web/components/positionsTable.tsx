import { mockPositions, mockAccountInfo } from '@/data/mockTradingData';
import { Badge } from '@workspace/ui/components/badge';
import { MoreHorizontal, X, Edit } from 'lucide-react';

export const PositionsTable = () => {
  return (
    <div className="bg-card border border-trading-border rounded-lg">
      {/* Tabs */}
      <div className="flex items-center border-b border-trading-border">
        <button className="px-4 py-3 text-sm font-medium text-trading-text-primary border-b-2 border-trading-info">
          Open
        </button>
        <button className="px-4 py-3 text-sm font-medium text-trading-text-muted hover:text-trading-text-secondary">
          Pending
        </button>
        <button className="px-4 py-3 text-sm font-medium text-trading-text-muted hover:text-trading-text-secondary">
          Closed
        </button>
        <div className="ml-auto px-4 py-3 flex items-center gap-4 text-xs text-trading-text-muted">
          <span>Equity: {mockAccountInfo.equity.toFixed(2)} USD</span>
          <span>Free Margin: {mockAccountInfo.freeMargin.toFixed(2)} USD</span>
          <span>Balance: {mockAccountInfo.balance.toFixed(2)} USD</span>
          <span>Margin: {mockAccountInfo.margin.toFixed(2)} USD</span>
          <span>Margin level: {mockAccountInfo.marginLevel.toFixed(2)}%</span>
          <span className="text-trading-danger">Total P/L USD: {mockAccountInfo.totalPnL}</span>
          <button className="text-trading-text-secondary hover:text-trading-text-primary">
            Close all
          </button>
        </div>
      </div>

      {/* Table Headers */}
      <div className="px-4 py-2 border-b border-trading-border bg-trading-bg-tertiary">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-trading-text-secondary">
          <span>Symbol</span>
          <span>Type</span>
          <span>Volume, lot</span>
          <span>Open price</span>
          <span>Current price</span>
          <span>T/P</span>
          <span>S/L</span>
          <span>Position</span>
          <span>Open time</span>
          <span>Swap U</span>
          <span>P/L_USD</span>
          <span></span>
        </div>
      </div>

      {/* Positions */}
      {mockPositions.map((position) => (
        <div key={position.id} className="px-4 py-3 border-b border-trading-border hover:bg-trading-bg-secondary">
          <div className="grid grid-cols-12 gap-4 items-center text-sm">
            <div className="font-medium text-trading-text-primary">
              {position.symbol}
            </div>
            <div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  position.type === 'buy' 
                    ? 'bg-trading-info-bg text-trading-info border-trading-info/20' 
                    : 'bg-trading-danger-bg text-trading-danger border-trading-danger/20'
                }`}
              >
                {position.type === 'buy' ? '● Buy' : '● Sell'}
              </Badge>
            </div>
            <div className="text-trading-text-primary">{position.volume}</div>
            <div className="text-trading-text-primary">{position.openPrice.toFixed(3)}</div>
            <div className="text-trading-text-primary">{position.currentPrice.toFixed(3)}</div>
            <div className="text-trading-text-muted">Add</div>
            <div className="text-trading-text-muted">Add</div>
            <div className="text-trading-text-primary">644708807</div>
            <div className="text-trading-text-secondary text-xs">{position.openTime}</div>
            <div className="text-trading-text-primary">{position.swapU}</div>
            <div className={`font-medium ${
              position.pnl >= 0 ? 'text-trading-success' : 'text-trading-danger'
            }`}>
              {position.pnl.toFixed(2)}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-trading-bg-tertiary rounded">
                <Edit className="h-3 w-3 text-trading-text-muted" />
              </button>
              <button className="p-1 hover:bg-trading-bg-tertiary rounded">
                <X className="h-3 w-3 text-trading-text-muted" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};