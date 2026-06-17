import { useState } from 'react';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const LUANDA_REGION: Region = {
  latitude: -8.838333,
  longitude: 13.234444,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function useMapRegion(initialRegion?: Partial<Region>) {
  const [region, setRegion] = useState<Region>({
    ...LUANDA_REGION,
    ...initialRegion,
  });

  function animateTo(coordinates: { latitude: number; longitude: number }) {
    setRegion((prev) => ({
      ...prev,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }));
  }

  return {
    region,
    setRegion,
    animateTo,
  };
}
