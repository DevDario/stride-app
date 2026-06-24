import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(2);
}

function formatPace(secPerKm: number): string {
  if (secPerKm === 0) return '--:--';
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface RunStatsOverlayProps {
  elapsedTime: number;
  distance: number;
  pace: number;
  isPaused: boolean;
}

export function RunStatsOverlay({
  elapsedTime,
  distance,
  pace,
  isPaused,
}: RunStatsOverlayProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 400 });
    opacity.value = withTiming(1, { duration: 400 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const paceLabel = useMemo(
    () => (isPaused ? '--:--' : formatPace(pace)),
    [isPaused, pace]
  );

  return (
    <Animated.View
      style={[styles.container, animatedStyle, { top: insets.top + 8 }]}
    >
      <View style={styles.grid}>
        <View style={styles.metric}>
          <Text style={styles.value}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.label}>Elapsed Time</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.value}>{formatDistance(distance)}</Text>
          <Text style={styles.label}>Distance (km)</Text>
        </View>
      </View>
      <View style={styles.paceRow}>
        <Text style={styles.value}>{paceLabel}</Text>
        <Text style={styles.label}>Current Pace (min/km)</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.92)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  paceRow: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  value: {
    fontFamily: 'DaysOne_400Regular',
    fontSize: 30,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontFamily: 'InstrumentSans_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
