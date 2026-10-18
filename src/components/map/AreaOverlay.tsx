import { Polygon } from 'react-native-maps';

type RatingLevel = 1 | 2 | 3 | 4 | 5;

type AreaGeometry =
  | { type: 'Polygon'; coordinates: [number, number][][] }
  | { type: 'MultiPolygon'; coordinates: [number, number][][][] };

interface AreaOverlayProps {
  id: string;
  geoJson: {
    type: 'Feature';
    properties: Record<string, unknown>;
    geometry: AreaGeometry;
  };
  rating: RatingLevel;
  opacity?: number;
}

const RATING_COLORS: Record<RatingLevel, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#EAB308',
  4: '#22C55E',
  5: '#10B981',
};

const RATING_OPACITIES: Record<RatingLevel, number> = {
  1: 0.35,
  2: 0.3,
  3: 0.25,
  4: 0.2,
  5: 0.2,
};

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function toLatLngs(ring: [number, number][]) {
  return ring.map(([longitude, latitude]) => ({ latitude, longitude }));
}

export function AreaOverlay({
  id,
  geoJson,
  rating,
  opacity = 1,
}: AreaOverlayProps) {
  const fillOpacity = RATING_OPACITIES[rating] * opacity;
  const color = hexToRgba(RATING_COLORS[rating], fillOpacity);

  const rings: [number, number][][] =
    geoJson.geometry.type === 'Polygon'
      ? geoJson.geometry.coordinates.slice(0, 1)
      : geoJson.geometry.coordinates.map((polygon) => polygon[0]);

  return (
    <>
      {rings.map((ring, index) => (
        <Polygon
          key={`${id}-${index}`}
          coordinates={toLatLngs(ring)}
          fillColor={color}
          strokeColor={color}
          strokeWidth={2}
        />
      ))}
    </>
  );
}
