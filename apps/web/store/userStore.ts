import { create } from "zustand";

interface UserState {
  token: string | null;
  balance: number | null;
  setToken: (token: string) => void;
  logout: () => void;
  fetchBalance: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  balance: null,
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, balance: null });
  },
  fetchBalance: async () => {
    const token = get().token;
    if (!token) {
      set({ balance: null });
      return;
    }
    try {
      const response = await fetch("/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ balance: data.balance ?? null });
      } else {
        set({ balance: null });
      }
    } catch {
      set({ balance: null });
    }
  },
}));