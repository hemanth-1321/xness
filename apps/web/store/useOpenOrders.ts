"use client";
import { create } from "zustand";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useUserStore } from "./userStore";

export interface Order {
  orderId: string;
  userId: string;
  asset: string;
  quantity: number;
  openingPrice: number;
  leverage: number;
  createdAt: string;
  type: "BUY" | "SELL";
}

interface OrderStore {
  openOrders: Order[];
  fetchOpenOrders: () => Promise<void>;
  setOpenOrders: (orders: Order[]) => void;
}

export const useOpenOrders = create<OrderStore>((set, get) => {
  const { token } = useUserStore.getState();

  return {
    openOrders: [],
    setOpenOrders: (orders: Order[]) => set({ openOrders: orders }),
    fetchOpenOrders: async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/buy/open-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        set({ openOrders: data.openOrders || [] });
      } catch (err) {
        console.error("Failed to fetch open orders", err);
      }
    },
  };
});
