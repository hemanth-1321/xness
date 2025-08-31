export interface Trade {
    stream: string;
    data: {
        e: string;
        E: number;
        s: string;
        t: number;
        p: string;
        q: string;
        T: string;
    }
}




export interface Order{
    userId:string,
    orderId:string,
    asset:string,
    quantity:number,
    openingPrice:number,
    leverage?:number,
    exposure?:number   //total exposure = quantity * openingPrice * leverage
    createdAt:Date
    type: "BUY" | "SELL" 
}




export interface User {
    id: string,
    email: string,
    hashedPassword: string,
    balance:number
}   

export interface Candle{
    open:number;
    high:number;
    low:number;
    close:number;
    volume:number;
    startTIme:number
}

export const CANDLE_INTERVALS: Record<string, number> = {
  "1m": 60 * 1000,
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
};

export const liveCandles: Record<string, Record<string, Candle>> = {}; 
