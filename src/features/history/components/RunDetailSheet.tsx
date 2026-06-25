import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Trophy } from 'lucide-react-native';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { RouteSparkline } from '../../challenges/components/RouteSparkline';
import type { RunHistoryItem } from '../types/history.types';

export interface RunDetailSheetRef {
  open: () => void;
}

interface RunDetailSheetProps {
  run: RunHistoryItem | null;
  onClose: () => void;
}

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

function StatCard({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        statStyles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        variant='title-md'
        className='font-sans-semi'
        style={{ color: colors.text }}
      >
        {value}
      </Text>
      <Text
        variant='body-sm'
        style={{ color: colors.textSecondary, marginTop: 4 }}
      >
        {label}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
});

export const RunDetailSheet = forwardRef<
  RunDetailSheetRef,
  RunDetailSheetProps
>(function RunDetailSheet({ run, onClose }, ref) {
  const sheetRef = useRef<BottomSheet>(null);
  const { colors, radii, spacing } = useTheme();
  const snapPoints = useMemo(() => ['60%', '80%'], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
  }));

  if (!run) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: radii.lg,
        borderTopRightRadius: radii.lg,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
        width: 36,
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant='title-lg'
          style={{ color: colors.text, marginBottom: 4 }}
        >
          Run Details
        </Text>
        <Text
          variant='body-sm'
          style={{ color: colors.textSecondary, marginBottom: spacing.md }}
        >
          {run.dateLabel}, {run.startTime} · {run.areaName}
        </Text>

        <View
          style={[
            styles.sparklineContainer,
            {
              borderRadius: radii.md,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <RouteSparkline
            coordinates={run.routeCoordinates}
            width={300}
            height={120}
            strokeWidth={3}
          />
        </View>

        <View style={[styles.statsGrid, { marginTop: spacing.md }]}>
          <StatCard label='Distance (km)' value={run.distance.toFixed(2)} />
          <StatCard label='Time' value={formatTime(run.elapsedTime)} />
          <StatCard label='Avg Pace' value={formatPace(run.avgPace)} />
          <StatCard label='Elevation Gain' value={`+${run.elevationGain} m`} />
        </View>

        {run.challengeId && run.placement && (
          <View
            style={[
              styles.challengeBanner,
              { backgroundColor: colors.primary },
            ]}
          >
            <Trophy size={24} color='#FFFFFF' />
            <View style={styles.challengeText}>
              <Text
                variant='body'
                className='font-sans-semi'
                style={{ color: '#FFFFFF' }}
              >
                #{run.placement} on {run.challengeTitle}
              </Text>
              <Text
                variant='body-sm'
                style={{ color: 'rgba(255,255,255,0.75)', marginTop: 2 }}
              >
                {run.placement === 1
                  ? "You're leading this challenge!"
                  : `Keep pushing to reach #1`}
              </Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={onClose}
          style={[
            styles.closeButton,
            { backgroundColor: colors.primary, marginTop: spacing.md },
          ]}
        >
          <Text variant='button' style={{ color: '#FFFFFF', marginLeft: 8 }}>
            Close
          </Text>
        </Pressable>

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  sparklineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    gap: 12,
  },
  challengeText: {
    flex: 1,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
});
