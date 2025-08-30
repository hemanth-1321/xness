"use client";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  CandlestickSeries,
  createChart,
  type CandlestickData,
  type IChartApi,
  type Time,
} from "lightweight-charts";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT", "SUIUSDT"];
const TIMEFRAMES = ["1m", "5m", "10m", "30m", "1h", "1d"] as const;
type TF = (typeof TIMEFRAMES)[number];

const TIMEFRAME_LABELS: Record<TF, string> = {
  "1m": "1 min",
  "5m": "5 min",
  "10m": "10 min",
  "30m": "30 min",
  "1h": "1 hour",
  "1d": "1 day",
};

export default function TradingChart() {
  const [symbol, setSymbol] = useState<string>(SYMBOLS[0] as string);
  const [timeframe, setTimeframe] = useState<TF>("1m");

  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize chart and socket
  useEffect(() => {
    if (!ref.current) return;

    // --- Create chart ---
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 400,
      layout: { background: { color: "#0b0e11" }, textColor: "#d1d4dc" },
      grid: { vertLines: { color: "#1f2a35" }, horzLines: { color: "#1f2a35" } },
      timeScale: { rightOffset: 2, borderVisible: false },
      crosshair: { mode: 0 },
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    seriesRef.current = series;

    // --- Socket.IO ---
    const socket = io("http://localhost:8080");
    socketRef.current = socket;

    const loadCandles = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/candles/${timeframe}?symbol=${symbol}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Network response was not ok");

        const json = await res.json();
        const data: CandlestickData[] = json.map((c: any) => ({
          time: Math.floor(new Date(c.bucket).getTime() / 1000) as Time,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }));

        seriesRef.current?.setData(data);
        chartRef.current?.timeScale().fitContent();
      } catch (err) {
        console.error("Error fetching candles:", err);
      }
    };

    loadCandles();

    // Subscribe to live trades
    socket.emit("subscribe-trades", { symbol });
    socket.on("live-trade", (trade) => {
      const price = parseFloat(trade.data.p);

      if (seriesRef.current?.__lastTradeLine) {
        seriesRef.current.removePriceLine(seriesRef.current.__lastTradeLine);
      }
      seriesRef.current.__lastTradeLine = seriesRef.current.createPriceLine({
        price,
        color: trade.data.m ? "red" : "green",
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: false,
        title: "Trade",
      });
    });

    const onResize = () => chart.applyOptions({ width: ref.current!.clientWidth });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
      socket.disconnect();
    };
  }, [symbol, timeframe]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {/* Symbol selector */}
        <select
          className="border px-2 py-1 rounded bg-black text-white"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Timeframe selector */}
        <select
          className="border px-2 py-1 rounded bg-black text-white"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as TF)}
        >
          {TIMEFRAMES.map((tf) => (
            <option key={tf} value={tf}>
              {TIMEFRAME_LABELS[tf]}
            </option>
          ))}
        </select>
      </div>

      {/* Chart container */}
      <div ref={ref} style={{ width: "100%", height: 400 }} />
    </div>
  );
}
