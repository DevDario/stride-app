import { Map, Camera } from '@maplibre/maplibre-react-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

const LUANDA_CENTER: [number, number] = [13.234444, -8.838333];
const DEFAULT_ZOOM = 12;

interface MapViewProps {
  children?: ReactNode;
  mapStyle?: string;
  centerCoordinate?: [number, number];
  zoomLevel?: number;
  onPress?: (feature: { geometry: { coordinates: [number, number] } }) => void;
}

export function StrideMapView({
  children,
  mapStyle = 'https://demotiles.maplibre.org/style.json',
  centerCoordinate = LUANDA_CENTER,
  zoomLevel = DEFAULT_ZOOM,
  onPress,
}: MapViewProps) {
  return (
    <Map
      style={styles.map}
      mapStyle={mapStyle}
      onPress={onPress}
      logoEnabled={false}
      attributionEnabled={false}
    >
      <Camera
        initialViewState={{
          center: centerCoordinate,
          zoom: zoomLevel,
        }}
      />
      {children}
    </Map>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
