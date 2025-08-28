"use client";
import {
  CandlestickSeries,
  createChart,
  type CandlestickData,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

type TF = "1m" | "5m" | "10m" | "30m" | "1h" | "1d";
export default function TradingChart({
  symbol = "BTCUSDT",
  timeframe = "1m" as TF,
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

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

const loadInitialData = async () => {
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

    seriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

    loadInitialData();

    const onResize = () =>
      chart.applyOptions({ width: ref.current!.clientWidth });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
    };
  }, [symbol, timeframe]);

  return <div ref={ref} style={{ width: "100%", height: 400 }} />;
}
