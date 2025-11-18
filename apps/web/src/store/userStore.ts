import create from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  balance: number;
  setBalance: (balance: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      balance: 0,
      setBalance: (balance) => set({ balance }),
    }),
    {
      name: 'user-store',
      getStorage: () => localStorage,
    }
  )
);