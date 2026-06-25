import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { useTheme } from '../../../theme/ThemeProvider';

interface RouteSparklineProps {
  coordinates: [number, number][];
  width: number;
  height: number;
  strokeWidth?: number;
  color?: string;
}

function normalizeCoords(
  coords: [number, number][],
  width: number,
  height: number
): string {
  if (coords.length < 2) return '';

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const padding = 0.1;
  const lngRange = maxLng - minLng || 1;
  const latRange = maxLat - minLat || 1;

  return coords
    .map(([lng, lat]) => {
      const x = ((lng - minLng + padding) / (lngRange + padding * 2)) * width;
      const y = ((maxLat - lat + padding) / (latRange + padding * 2)) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

export function RouteSparkline({
  coordinates,
  width,
  height,
  strokeWidth = 2,
  color,
}: RouteSparklineProps) {
  const { colors } = useTheme();
  const points = useMemo(
    () => normalizeCoords(coordinates, width, height),
    [coordinates, width, height]
  );

  if (coordinates.length < 2) {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: colors.surface,
          borderRadius: 4,
        }}
      />
    );
  }

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill='none'
        stroke={color ?? colors.primary}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
}
