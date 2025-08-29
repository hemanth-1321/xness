"use client";
import {
  CandlestickSeries,
  createChart,
  type CandlestickData,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"; // adjust path to your ui folder

type TF = "1m" | "5m" | "10m" | "30m" | "1h" | "1d";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function TradingChart({ timeframe = "1m" as TF }) {
  const [symbol, setSymbol] = useState<string>(SYMBOLS[0] ?? "");
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // --- Initialize chart ---
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 400,
      layout: { background: { color: "#0b0e11" }, textColor: "#d1d4dc" },
      grid: {
        vertLines: { color: "#1f2a35" },
        horzLines: { color: "#1f2a35" },
      },
      timeScale: {
        rightOffset: 2,
        fixLeftEdge: false,
        fixRightEdge: false,
        borderVisible: false,
      },
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

    // --- Candle updates ---
    const candleListener = (candles: any[]) => {
      const formatted: CandlestickData[] = candles.map((c) => ({
        time: Math.floor(new Date(c.bucket).getTime() / 1000) as Time,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));
      const last = seriesRef.current?.data().slice(-1)[0];
      const newest = formatted[formatted.length - 1];
      if (last?.time === newest?.time) seriesRef.current.update(newest);
      else seriesRef.current.update(newest);
    };

    socket.on(`candles-update-${timeframe}-${symbol}`, candleListener);

    // --- Live trades ---
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

    const onResize = () =>
      chart.applyOptions({ width: ref.current!.clientWidth });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
      socket.disconnect();
    };
  }, [symbol, timeframe]);

  return (
    <div>
      <Select value={symbol} onValueChange={(val) => setSymbol(val)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Symbol" />
        </SelectTrigger>
        <SelectContent>
          {SYMBOLS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div ref={ref} style={{ width: "100%", height: 400, marginTop: 8 }} />
    </div>
  );
}
