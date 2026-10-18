import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  MAP_TYPES,
  type MapPressEvent,
  type MapStyleElement,
  type Region,
} from 'react-native-maps';

const LUANDA_CENTER: [number, number] = [13.234444, -8.838333];
const DEFAULT_ZOOM = 11;

export const DARK_MAP_STYLE: MapStyleElement[] = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', stylers: [{ color: '#1a1a1f' }] },
  { featureType: 'road', stylers: [{ color: '#2d2d34' }] },
  { featureType: 'water', stylers: [{ color: '#101014' }] },
];

function zoomToDelta(zoom: number): number {
  return 360 / Math.pow(2, zoom);
}

function toRegion(center: [number, number], zoom: number): Region {
  const delta = zoomToDelta(zoom);
  return {
    latitude: center[1],
    longitude: center[0],
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export interface StrideMapViewRef {
  flyTo: (center: [number, number], zoom?: number, pitch?: number) => void;
  easeTo: (
    center: [number, number],
    zoom?: number,
    pitch?: number,
    duration?: number
  ) => void;
}

interface MapViewProps {
  children?: ReactNode;
  centerCoordinate?: [number, number];
  zoomLevel?: number;
  onPress?: (e: MapPressEvent) => void;
}

export const StrideMapView = forwardRef<StrideMapViewRef, MapViewProps>(
  function StrideMapView(
    {
      children,
      centerCoordinate = LUANDA_CENTER,
      zoomLevel = DEFAULT_ZOOM,
      onPress,
    },
    ref
  ) {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
      flyTo: (center: [number, number], zoom: number = DEFAULT_ZOOM) => {
        mapRef.current?.animateToRegion(toRegion(center, zoom), 1000);
      },
      easeTo: (
        center: [number, number],
        zoom: number = DEFAULT_ZOOM,
        _pitch?: number,
        duration: number = 2000
      ) => {
        mapRef.current?.animateToRegion(toRegion(center, zoom), duration);
      },
    }));

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={MAP_TYPES.STANDARD}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={toRegion(centerCoordinate, zoomLevel)}
        onPress={onPress}
        showsCompass
        showsScale
      >
        {children}
      </MapView>
    );
  }
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
