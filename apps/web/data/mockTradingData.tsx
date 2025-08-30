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
interface instrumentsData {
  id: string;
  symbol: string;
  name: string;
}

export const instruments:instrumentsData[] = [
  { id: "btcusdt", symbol: "BTCUSDT", name: "Bitcoin USDT" },
  { id: "ethusdt", symbol: "ETHUSDT", name: "Ethereum USDT" },
  { id: "solusdt", symbol: "SOLUSDT", name: "Solana USDT" },
  { id: "xrpusdt", symbol: "XRPUSDT", name: "Ripple USDT" },
  { id: "dogeusdt", symbol: "DOGEUSDT", name: "Dogecoin USDT" },
  { id: "suiusdt", symbol: "SUIUSDT", name: "SUI USDT" },
];






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