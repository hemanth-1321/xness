import create from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UserState {
  balance: number | null;
  setBalance: (balance: number) => void;
}

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    balance: null,
    setBalance: (balance) => set({ balance })
  }))
);

export default useUserStore;