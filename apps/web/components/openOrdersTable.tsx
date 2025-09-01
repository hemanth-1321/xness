"use client";
import { useEffect } from "react";
import { useTrades } from "@/store/tradeStore";
import { useOpenOrders } from "@/store/useOpenOrders";

export const OpenOrdersTable = () => {
  const { openOrders, fetchOpenOrders } = useOpenOrders();
  const prices = useTrades((state) => state.prices);

  useEffect(() => {
    fetchOpenOrders();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="text-lg font-semibold mb-3">Open Orders</h2>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-trading-border text-trading-text-muted">
            <th>Asset</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Entry</th>
            <th>Current</th>
            <th>Leverage</th>
            <th>Unrealized PnL</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((order) => {
            const livePrice = prices[order.asset]?.price ?? order.openingPrice;
            const pnl =
              order.type === "BUY"
                ? (livePrice - order.openingPrice) * order.quantity * order.leverage
                : (order.openingPrice - livePrice) * order.quantity * order.leverage;

            return (
              <tr key={order.orderId} className="border-b border-trading-border/40">
                <td>{order.asset}</td>
                <td className={order.type === "BUY" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                  {order.type}
                </td>
                <td>{order.quantity}</td>
                <td>{order.openingPrice.toFixed(2)}</td>
                <td>{livePrice.toFixed(2)}</td>
                <td>{order.leverage}x</td>
                <td className={pnl >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                  {pnl.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
