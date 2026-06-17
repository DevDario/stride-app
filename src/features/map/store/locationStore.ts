import { create } from 'zustand';

export type LocationPermissionState =
  | 'unknown'
  | 'granted'
  | 'denied'
  | 'blocked';

interface LocationState {
  permissionState: LocationPermissionState;
  foregroundGranted: boolean;
  backgroundGranted: boolean;
  lastKnownLatitude: number | null;
  lastKnownLongitude: number | null;
  setPermissionState: (state: LocationPermissionState) => void;
  setForegroundGranted: (granted: boolean) => void;
  setBackgroundGranted: (granted: boolean) => void;
  setLastKnownLocation: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  permissionState: 'unknown',
  foregroundGranted: false,
  backgroundGranted: false,
  lastKnownLatitude: null,
  lastKnownLongitude: null,
  setPermissionState: (state) => set({ permissionState: state }),
  setForegroundGranted: (granted) => set({ foregroundGranted: granted }),
  setBackgroundGranted: (granted) => set({ backgroundGranted: granted }),
  setLastKnownLocation: (lat, lng) =>
    set({ lastKnownLatitude: lat, lastKnownLongitude: lng }),
}));
