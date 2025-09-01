import { create } from "zustand";

interface OrderStore {
  orders: any[];
  setOrders: (orders: any[]) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
}));
