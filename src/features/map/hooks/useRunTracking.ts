import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';

import { LOCATION_TASK_NAME } from '../../../tasks/locationTask';
import { useRunSessionStore } from '../run/RunSession';
import type { Coordinate } from '../types/map.types';

const LOCATION_TASK_OPTIONS: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 5,
  timeInterval: 1000,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: 'Run in progress',
    notificationBody: 'Tracking your route...',
  },
};

const FOREGROUND_WATCH_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  distanceInterval: 5,
  timeInterval: 1000,
};

export function useRunTracking() {
  const store = useRunSessionStore();
  const [tick, setTick] = useState(0);
  const foregroundSubRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    return () => {
      foregroundSubRef.current?.remove();
      foregroundSubRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (store.state !== 'running') return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [store.state]);

  const elapsedTime = useMemo(() => {
    if (store.state === 'idle') return 0;
    if (store.state === 'finished') return store.finalElapsedTime;
    if (store.startedAt === null) return 0;
    const paused =
      store.totalPausedDuration +
      (store.pausedAt !== null ? Date.now() - store.pausedAt : 0);
    return Math.floor((Date.now() - store.startedAt - paused) / 1000);
  }, [
    store.state,
    store.startedAt,
    store.totalPausedDuration,
    store.pausedAt,
    store.finalElapsedTime,
    tick,
  ]);

  const pace = useMemo(() => {
    if (store.distance < 200) return 0;
    const hours = elapsedTime / 3600;
    const km = store.distance / 1000;
    return Math.round((hours * 60) / km);
  }, [store.distance, elapsedTime]);

  const lastCoordinate: Coordinate | null = useMemo(() => {
    if (store.coordinates.length === 0) return null;
    return store.coordinates[store.coordinates.length - 1];
  }, [store.coordinates]);

  function stopForegroundUpdates() {
    foregroundSubRef.current?.remove();
    foregroundSubRef.current = null;
  }

  async function startForegroundUpdates(): Promise<void> {
    stopForegroundUpdates();
    foregroundSubRef.current = await Location.watchPositionAsync(
      FOREGROUND_WATCH_OPTIONS,
      (location) => {
        const session = useRunSessionStore.getState();
        if (session.state !== 'running') return;
        session.addCoordinate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
        });
      }
    );
  }

  async function startLocationUpdates(): Promise<boolean> {
    stopForegroundUpdates();
    try {
      const hasBackground =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasBackground) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
      await Location.startLocationUpdatesAsync(
        LOCATION_TASK_NAME,
        LOCATION_TASK_OPTIONS
      );
      return true;
    } catch (error) {
      console.warn(
        'Background location updates unavailable, falling back to foreground tracking:',
        error
      );
      try {
        await startForegroundUpdates();
        return true;
      } catch (foregroundError) {
        console.warn(
          'Failed to start foreground location updates:',
          foregroundError
        );
        return false;
      }
    }
  }

  async function startRun(): Promise<boolean> {
    const ok = await startLocationUpdates();
    if (!ok) return false;
    store.startRun();
    return true;
  }

  function beginRun() {
    store.startRun();
  }

  async function pauseRun(): Promise<boolean> {
    try {
      const hasBackground =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasBackground) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
      stopForegroundUpdates();
      store.pauseRun();
      return true;
    } catch (error) {
      console.warn('Failed to pause run:', error);
      return false;
    }
  }

  async function resumeRun(): Promise<boolean> {
    const ok = await startLocationUpdates();
    if (!ok) return false;
    store.resumeRun();
    return true;
  }

  async function stopRun() {
    const hasBackground =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasBackground) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
    stopForegroundUpdates();
    store.stopRun();
  }

  return {
    state: store.state,
    isRunning: store.state === 'running',
    isPaused: store.state === 'paused',
    isFinished: store.state === 'finished',
    isLocked: store.isLocked,
    elapsedTime,
    distance: store.distance,
    pace,
    coordinates: store.coordinates,
    lastCoordinate,
    challengeId: store.challengeId,
    startRun,
    startLocationUpdates,
    beginRun,
    pauseRun,
    resumeRun,
    stopRun,
    setIsLocked: store.setIsLocked,
    resetRun: store.reset,
  };
}
