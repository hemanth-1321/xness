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
  type: "LONG" | "SHORT";
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
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // Convert numeric keys to array
        const ordersArray: Order[] = Object.keys(data)
          .filter((key) => !isNaN(Number(key)))
          .map((key) => data[key]);

        set({ openOrders: ordersArray });
      } catch (err) {
        console.error("Failed to fetch open orders", err);
      }
    },
  };
});
