export interface TradingInstrument {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  signal: 'buy' | 'sell' | 'neutral';
  volume?: number;
  ask?: number;
}

export interface CandlestickData {
  bucket: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  pnl: number;
  openTime: string;
  swapU: number;
}

export const mockInstruments: TradingInstrument[] = [
  {
    id: 'btcusdt',
    symbol: 'BTCUSDT',
    name: 'Bitcoin USDT',
    price: 112790.56,
    change: -44.8,
    changePercent: -0.04,
    signal: 'sell'
  },
  {
    id: 'ethusdt',
    symbol: 'ETHUSDT',
    name: 'Ethereum USDT',
    price: 4557.35,
    change: -3.77,
    changePercent: -0.08,
    signal: 'sell'
  },
  {
    id: 'solusdt',
    symbol: 'SOLUSDT',
    name: 'Solana USDT',
    price: 211.59,
    change: -0.25,
    changePercent: -0.12,
    signal: 'sell'
  },
  {
    id: 'xauusd',
    symbol: 'XAU/USD',
    name: 'Gold vs US Dollar',
    price: 3400.79,
    change: -0.14,
    changePercent: -0.004,
    signal: 'buy'
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro vs US Dollar',
    price: 1.16149,
    change: 0.0023,
    changePercent: 0.20,
    signal: 'buy'
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound vs US Dollar',
    price: 1.35082,
    change: -0.0045,
    changePercent: -0.33,
    signal: 'sell'
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar vs Japanese Yen',
    price: 147.143,
    change: -1.25,
    changePercent: -0.84,
    signal: 'sell'
  },
  {
    id: 'usoil',
    symbol: 'USOIL',
    name: 'US Oil',
    price: 63.527,
    change: -2.14,
    changePercent: -3.26,
    signal: 'sell'
  }
];

// Real candlestick data from your API
export const realCandlestickData: CandlestickData[] = [
  {
    "bucket": "2025-08-28T05:46:00.000Z",
    "symbol": "BTCUSDT",
    "open": 112835.36,
    "high": 112835.36,
    "low": 112790.56,
    "close": 112790.56,
    "volume": 5.08029999999997
  },
  {
    "bucket": "2025-08-28T05:46:00.000Z",
    "symbol": "ETHUSDT",
    "open": 4561.12,
    "high": 4561.13,
    "low": 4557.12,
    "close": 4557.35,
    "volume": 311.988000000007
  },
  {
    "bucket": "2025-08-28T05:46:00.000Z",
    "symbol": "SOLUSDT",
    "open": 211.84,
    "high": 211.91,
    "low": 211.58,
    "close": 211.59,
    "volume": 1372.84900000002
  },
  {
    "bucket": "2025-08-28T05:45:00.000Z",
    "symbol": "BTCUSDT",
    "open": 112805.65,
    "high": 112835.36,
    "low": 112805.65,
    "close": 112835.36,
    "volume": 3.12381
  },
  {
    "bucket": "2025-08-28T05:45:00.000Z",
    "symbol": "ETHUSDT",
    "open": 4560.01,
    "high": 4563.11,
    "low": 4560,
    "close": 4561.13,
    "volume": 147.399300000001
  }
];

// Filter data by symbol
export const getCandleDataBySymbol = (symbol: string): CandlestickData[] => {
  return realCandlestickData
    .filter(candle => candle.symbol === symbol)
    .sort((a, b) => new Date(a.bucket).getTime() - new Date(b.bucket).getTime());
};

// Get available symbols from the data
export const getAvailableSymbols = (): string[] => {
  return [...new Set(realCandlestickData.map(candle => candle.symbol))];
};

export const mockPositions: Position[] = [
  {
    id: 'pos1',
    symbol: 'BTCUSDT',
    type: 'buy',
    volume: 0.01,
    openPrice: 112835.36,
    currentPrice: 112790.56,
    pnl: -0.45,
    openTime: 'Aug 28, 5:45:00 AM',
    swapU: 0
  }
];

export const mockAccountInfo = {
  balance: 10000.00,
  equity: 9999.55,
  freeMargin: 9982.55,
  margin: 17.00,
  marginLevel: 58822.71,
  totalPnL: -0.45
};