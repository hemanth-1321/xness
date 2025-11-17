import { create } from "zustand";

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  balance: number;
  setBalance: (balance: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  balance: typeof window !== "undefined" ? parseFloat(localStorage.getItem("balance") ?? "0") : 0,
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setBalance: (balance) => {
    localStorage.setItem("balance", balance.toString());
    set({ balance });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    set({ token: null, balance: 0 });
  },
}));