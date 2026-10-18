import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Coordinate } from '../types/map.types';

export interface CompletedRun {
  id: string;
  startedAt: number;
  finishedAt: number;
  durationSec: number;
  distanceM: number;
  coordinates: Coordinate[];
  challengeId?: string;
}

interface RunHistoryState {
  completedRuns: CompletedRun[];
  addRun: (run: CompletedRun) => void;
  removeRun: (id: string) => void;
  clearRuns: () => void;
}

export const useRunHistoryStore = create<RunHistoryState>()(
  persist(
    (set) => ({
      completedRuns: [],

      addRun: (run) =>
        set((state) => ({ completedRuns: [run, ...state.completedRuns] })),

      removeRun: (id) =>
        set((state) => ({
          completedRuns: state.completedRuns.filter((r) => r.id !== id),
        })),

      clearRuns: () => set({ completedRuns: [] }),
    }),
    {
      name: 'stride-run-history',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
