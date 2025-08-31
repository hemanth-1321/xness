import { create } from "zustand";

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));
