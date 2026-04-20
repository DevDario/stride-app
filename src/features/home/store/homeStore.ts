import { RunSchedule } from '@store/onboardingStore';
import { create } from 'zustand';

export interface User {
  name: string;
  level: string;
  avatarUrl?: string;
  onboardingComplete: boolean;
  preferredSchedules: RunSchedule[]
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
