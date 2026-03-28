import { create } from 'zustand';

export interface User {
  name: string;
  role: string;
}

interface HomeState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
