import { create } from 'zustand';

import type { Coordinate, RunState } from '../types/map.types';

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface RunSessionState {
  state: RunState;
  startedAt: number | null;
  pausedAt: number | null;
  totalPausedDuration: number;
  coordinates: Coordinate[];
  distance: number;
  isLocked: boolean;
  challengeId?: string;
  finalElapsedTime: number;

  startRun: () => void;
  pauseRun: () => void;
  resumeRun: () => void;
  stopRun: () => void;
  addCoordinate: (coord: Coordinate) => void;
  setIsLocked: (locked: boolean) => void;
  reset: () => void;
}

export const useRunSessionStore = create<RunSessionState>((set, get) => ({
  state: 'idle',
  startedAt: null,
  pausedAt: null,
  totalPausedDuration: 0,
  coordinates: [],
  distance: 0,
  isLocked: false,
  challengeId: undefined,
  finalElapsedTime: 0,

  startRun: () => {
    const now = Date.now();
    set({
      state: 'running',
      startedAt: now,
      pausedAt: null,
      totalPausedDuration: 0,
      coordinates: [],
      distance: 0,
      isLocked: false,
    });
  },

  pauseRun: () => {
    set({ state: 'paused', pausedAt: Date.now() });
  },

  resumeRun: () => {
    const { pausedAt, totalPausedDuration } = get();
    if (pausedAt === null) return;
    const pauseDuration = Date.now() - pausedAt;
    set({
      state: 'running',
      pausedAt: null,
      totalPausedDuration: totalPausedDuration + pauseDuration,
    });
  },

  stopRun: () => {
    const { startedAt, pausedAt, totalPausedDuration } = get();
    if (startedAt !== null) {
      const pause =
        totalPausedDuration + (pausedAt !== null ? Date.now() - pausedAt : 0);
      set({
        state: 'finished',
        finalElapsedTime: Math.floor((Date.now() - startedAt - pause) / 1000),
      });
    } else {
      set({ state: 'finished', finalElapsedTime: 0 });
    }
  },

  addCoordinate: (coord: Coordinate) => {
    const { coordinates } = get();
    const lastCoord = coordinates[coordinates.length - 1];
    let addedDistance = 0;

    if (lastCoord) {
      addedDistance = haversineDistance(
        lastCoord.latitude,
        lastCoord.longitude,
        coord.latitude,
        coord.longitude
      );
    }

    set({
      coordinates: [...coordinates, coord],
      distance: get().distance + addedDistance,
    });
  },

  setIsLocked: (locked: boolean) => set({ isLocked: locked }),

  reset: () =>
    set({
      state: 'idle',
      startedAt: null,
      pausedAt: null,
      totalPausedDuration: 0,
      coordinates: [],
      distance: 0,
      isLocked: false,
      challengeId: undefined,
      finalElapsedTime: 0,
    }),
}));

export function getRunSessionState() {
  return useRunSessionStore.getState();
}
