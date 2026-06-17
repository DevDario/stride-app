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
      data={{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}
    >
      <Layer
        type='line'
        id={`${id}-line`}
        source={`${id}-source`}
        paint={{
          'line-color': color,
          'line-width': width,
          'line-opacity': 0.9,
        }}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
      />
    </GeoJSONSource>
  );
}
