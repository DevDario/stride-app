import * as Location from 'expo-location';
import { useEffect } from 'react';

import { useLocationStore } from '../store/locationStore';

export function useUserLocation() {
  const {
    foregroundGranted,
    lastKnownLatitude,
    lastKnownLongitude,
    setForegroundGranted,
    setLastKnownLocation,
    setPermissionState,
  } = useLocationStore();

  useEffect(() => {
    requestAndTrackLocation();
  }, []);

  async function requestAndTrackLocation() {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    setForegroundGranted(granted);
    setPermissionState(granted ? 'granted' : 'denied');

    if (!granted) return;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setLastKnownLocation(location.coords.latitude, location.coords.longitude);

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (loc) => {
        setLastKnownLocation(loc.coords.latitude, loc.coords.longitude);
      }
    );

    return () => subscription.remove();
  }

  return {
    latitude: lastKnownLatitude,
    longitude: lastKnownLongitude,
    hasPermission: foregroundGranted,
  };
}
