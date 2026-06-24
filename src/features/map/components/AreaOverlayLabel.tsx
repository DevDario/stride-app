import { Marker } from '@maplibre/maplibre-react-native';
import { Star } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'src/theme/ThemeProvider';

interface AreaOverlayLabelProps {
  areaId: string;
  rating: number;
  centroid: [number, number];
}

export function AreaOverlayLabel({
  areaId,
  rating,
  centroid,
}: AreaOverlayLabelProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  const { colors } = useTheme();

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 250 });
    scale.value = withTiming(1, { duration: 250 });
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Marker id={areaId} lngLat={centroid}>
      <Animated.View style={animatedStyle}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 3,
            gap: 1,
          }}
        >
          <Star
            size={16}
            color={colors.primary}
            fill={colors.primary}
            strokeWidth={1.5}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.primary,
              lineHeight: 13,
            }}
          >
            {rating.toFixed(1)}
          </Text>
        </View>
      </Animated.View>
    </Marker>
  );
}
