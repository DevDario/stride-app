import { create } from 'zustand';

interface RootState {
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<RootState>((set) => ({
  hasHydrated: false,
  setHasHydrated: (state) => set({ hasHydrated: state }),
}));
