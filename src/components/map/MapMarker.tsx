import { useEffect, type ReactNode } from 'react';
import { Marker } from 'react-native-maps';
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
    <Marker
      identifier={id}
      coordinate={{ latitude: lngLat[1], longitude: lngLat[0] }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Marker>
  );
}
