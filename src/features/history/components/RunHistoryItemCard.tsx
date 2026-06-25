import { ChevronRight } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { RouteSparkline } from '../../challenges/components/RouteSparkline';
import type { RunHistoryItem } from '../types/history.types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatPace(secPerKm: number): string {
  if (secPerKm === 0) return '--:--';
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface RunHistoryItemCardProps {
  run: RunHistoryItem;
  onPress: (run: RunHistoryItem) => void;
}

export const RunHistoryItemCard = memo(function RunHistoryItemCard({
  run,
  onPress,
}: RunHistoryItemCardProps) {
  const { colors, radii, spacing } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(run)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.md,
          marginBottom: 8,
          marginHorizontal: 16,
        },
      ]}
    >
      <View style={styles.inner}>
        <View
          style={[
            styles.sparklineBox,
            {
              borderRadius: radii.lg,
              backgroundColor: colors.background,
            },
          ]}
        >
          <RouteSparkline
            coordinates={run.routeCoordinates}
            width={56}
            height={56}
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.info}>
          <Text
            variant='body'
            className='font-sans-semi'
            style={{ color: colors.text }}
          >
            {run.dateLabel}, {run.startTime} · {run.areaName}
          </Text>
          <Text
            variant='body-sm'
            style={{ color: colors.textSecondary, marginTop: 2 }}
          >
            {run.distance.toFixed(1)} km · {formatTime(run.elapsedTime)} ·{' '}
            {formatPace(run.avgPace)} /km
          </Text>
        </View>

        <ChevronRight size={18} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {},
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sparklineBox: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  info: {
    flex: 1,
  },
});
