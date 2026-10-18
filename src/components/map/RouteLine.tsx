import { Polyline } from 'react-native-maps';

interface RouteLineProps {
  id: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
}

export function RouteLine({
  coordinates,
  color = '#3B82F6',
  width = 4,
}: RouteLineProps) {
  return (
    <Polyline
      coordinates={coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      }))}
      strokeColor={color}
      strokeWidth={width}
      lineCap='round'
      lineJoin='round'
      geodesic
    />
  );
}
