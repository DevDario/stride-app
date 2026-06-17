import { Marker } from '@maplibre/maplibre-react-native';
import { useEffect, type ReactNode } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface MapMarkerProps {
  id: string;
  lngLat: [number, number];
  children?: ReactNode;
}

export function MapMarker({ id, lngLat, children }: MapMarkerProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Marker id={id} lngLat={lngLat}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Marker>
  );
}
