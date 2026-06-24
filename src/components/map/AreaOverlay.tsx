import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';

type RatingLevel = 1 | 2 | 3 | 4 | 5;

interface AreaOverlayProps {
  id: string;
  geoJson: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
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

export function AreaOverlay({
  id,
  geoJson,
  rating,
  opacity = 1,
}: AreaOverlayProps) {
  const fillOpacity = RATING_OPACITIES[rating] * opacity;
  return (
    <GeoJSONSource
      id={`${id}-source`}
      data={{
        type: 'FeatureCollection',
        features: [
          {
            ...geoJson,
            properties: { rating },
          },
        ],
      }}
    >
      <Layer
        type='fill'
        id={`${id}-fill`}
        source={`${id}-source`}
        paint={{
          'fill-color': RATING_COLORS[rating],
          'fill-opacity': fillOpacity,
          'fill-outline-color': RATING_COLORS[rating],
        }}
      />
    </GeoJSONSource>
  );
}
