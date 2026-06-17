import { Camera, Map } from '@maplibre/maplibre-react-native';
import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

const LUANDA_CENTER: [number, number] = [13.234444, -8.838333];
const DEFAULT_ZOOM = 11;

export const MAP_STYLES = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  darkNoLabels:
    'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  fallback: 'https://api.protomaps.com/styles/v5/black/en.json',
} as const;

const DEFAULT_MAP_STYLE = MAP_STYLES.dark;

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
  mapStyle?: string | object;
  centerCoordinate?: [number, number];
  zoomLevel?: number;
}

export const StrideMapView = forwardRef<StrideMapViewRef, MapViewProps>(
  function StrideMapView(
    {
      children,
      mapStyle = DEFAULT_MAP_STYLE,
      centerCoordinate = LUANDA_CENTER,
      zoomLevel = DEFAULT_ZOOM,
    },
    ref
  ) {
    const cameraRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      flyTo: (center: [number, number], zoom?: number, pitch?: number) => {
        cameraRef.current?.flyTo({
          center,
          zoom: zoom ?? DEFAULT_ZOOM,
          pitch: pitch ?? 0,
          duration: 1000,
        });
      },
      easeTo: (
        center: [number, number],
        zoom?: number,
        pitch?: number,
        duration?: number
      ) => {
        cameraRef.current?.easeTo({
          center,
          zoom: zoom ?? DEFAULT_ZOOM,
          pitch: pitch ?? 0,
          duration: duration ?? 2000,
        });
      },
    }));

    return (
      <Map
        style={styles.map}
        mapStyle={mapStyle as never}
        logo
        attribution
        androidView='texture'
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: centerCoordinate,
            zoom: zoomLevel,
          }}
        />
        {children}
      </Map>
    );
  }
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
