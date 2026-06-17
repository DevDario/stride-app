import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';

interface RouteLineProps {
  id: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
}

export function RouteLine({
  id,
  coordinates,
  color = '#3B82F6',
  width = 4,
}: RouteLineProps) {
  return (
    <GeoJSONSource
      id={`${id}-source`}
      shape={{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}
    >
      <Layer
        id={`${id}-line`}
        sourceId={`${id}-source`}
        style={{
          lineColor: color,
          lineWidth: width,
          lineOpacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </GeoJSONSource>
  );
}
