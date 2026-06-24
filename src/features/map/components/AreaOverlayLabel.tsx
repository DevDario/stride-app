import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface BreakdownEntry {
  safety: number;
  vibe: number;
  crowd: number;
}

interface AreaOverlayLabelProps {
  name: string;
  rating: number;
  breakdown: BreakdownEntry;
  onDismiss: () => void;
}

function RatingStars({ score }: { score: number }) {
  const full = Math.floor(score);
  const parts: string[] = [];
  for (let i = 0; i < 5; i++) {
    parts.push(i < full ? '★' : '☆');
  }
  return (
    <Text style={labelStyles.stars}>
      {parts.join(' ')} {score.toFixed(1)}
    </Text>
  );
}

function BreakdownPill({ label, value }: { label: string; value: number }) {
  const color = value >= 4 ? '#22C55E' : value >= 3 ? '#EAB308' : '#EF4444';
  return (
    <View style={[labelStyles.pill, { borderColor: color }]}>
      <Text style={[labelStyles.pillText, { color }]}>
        {label} {value.toFixed(1)}
      </Text>
    </View>
  );
}

export function AreaOverlayLabel({
  name,
  rating,
  breakdown,
  onDismiss,
}: AreaOverlayLabelProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable style={labelStyles.overlay} onPress={onDismiss}>
      <Animated.View style={[labelStyles.card, animatedStyle]}>
        <Text style={labelStyles.name}>{name}</Text>
        <RatingStars score={rating} />
        <View style={labelStyles.breakdownRow}>
          <BreakdownPill label='Safety' value={breakdown.safety} />
          <BreakdownPill label='Vibe' value={breakdown.vibe} />
          <BreakdownPill label='Crowd' value={breakdown.crowd} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const labelStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 60,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: '#F59E0B',
    marginBottom: 10,
    letterSpacing: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
