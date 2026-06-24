import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Camera, Map } from '@maplibre/maplibre-react-native';
import { Flag, Share2, Star, Trophy } from 'lucide-react-native';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MAP_STYLES } from 'src/components/map/MapView';
import { RouteLine } from 'src/components/map/RouteLine';
import { useTheme } from 'src/theme/ThemeProvider';

import type { Coordinate } from '../types/map.types';

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

function convertToLngLat(coords: Coordinate[]): [number, number][] {
  return coords.map((c) => [c.longitude, c.latitude]);
}

interface PostRunBottomSheetProps {
  elapsedTime: number;
  distance: number;
  pace: number;
  coordinates: Coordinate[];
  challengeId?: string;
  onClose: () => void;
}

export interface PostRunBottomSheetRef {
  open: () => void;
}

export const PostRunBottomSheet = forwardRef<
  PostRunBottomSheetRef,
  PostRunBottomSheetProps
>(function PostRunBottomSheet(
  { elapsedTime, distance, pace, coordinates, challengeId, onClose },
  ref
) {
  const sheetRef = useRef<BottomSheet>(null);
  const { colors, radii } = useTheme();
  const snapPoints = useMemo(() => ['75%', '95%'], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
  }));

  const handleAction = useCallback((action: string) => {
    console.log(`[PostRun] Action: ${action}`);
  }, []);

  const lngLatCoords = useMemo(
    () => convertToLngLat(coordinates),
    [coordinates]
  );

  const region = useMemo(() => {
    if (coordinates.length === 0) return undefined;
    const lngs = coordinates.map((c) => c.longitude);
    const lats = coordinates.map((c) => c.latitude);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const padding = 0.005;
    return {
      center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2] as [
        number,
        number,
      ],
      lngDelta: maxLng - minLng + padding * 2,
      latDelta: maxLat - minLat + padding * 2,
    };
  }, [coordinates]);

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
      handleIndicatorStyle={{ backgroundColor: '#AFAFAF', width: 36 }}
    >
      <BottomSheetView style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {coordinates.length > 1 && region && (
            <View style={styles.mapPreview}>
              <Map
                style={styles.map}
                mapStyle={MAP_STYLES.dark as never}
                logo={false}
                attribution={false}
              >
                <Camera
                  bounds={[
                    region.center[0] - region.lngDelta / 2,
                    region.center[1] - region.latDelta / 2,
                    region.center[0] + region.lngDelta / 2,
                    region.center[1] + region.latDelta / 2,
                  ]}
                  padding={{ top: 40, bottom: 40, left: 40, right: 40 }}
                  pitch={60}
                />
                <RouteLine
                  id='run-route'
                  coordinates={lngLatCoords}
                  color='#10B981'
                  width={3}
                />
              </Map>
            </View>
          )}

          <View style={styles.statsGrid}>
            <StatCard
              label='Distance (km)'
              value={(distance / 1000).toFixed(2)}
            />
            <StatCard label='Time' value={formatTime(elapsedTime)} />
            <StatCard label='Avg Pace' value={formatPace(pace)} />
            <StatCard label='Elevation Gain' value='+0 m' />
          </View>

          {challengeId && (
            <View style={styles.challengeBanner}>
              <Trophy size={24} color='#FCD34D' />
              <View style={styles.challengeText}>
                <Text style={styles.challengeTitle}>
                  #1 on {challengeId} Leaderboard
                </Text>
                <Text style={styles.challengeSub}>
                  You're crushing it! Keep pushing.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actionsRow}>
            <ActionButton
              icon={Star}
              label='Rate Area'
              onPress={() => handleAction('rate')}
            />
            <ActionButton
              icon={Flag}
              label='Challenge'
              onPress={() => handleAction('challenge')}
            />
            <ActionButton
              icon={Share2}
              label='Share'
              onPress={() => handleAction('share')}
            />
          </View>

          <Pressable
            onPress={onClose}
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.saveButtonText}>Save & Close</Text>
          </Pressable>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={statStyles.card}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    minWidth: '45%',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#374151',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
});

function ActionButton({
  icon: Icon,
  label,
  onPress,
}: {
  icon: typeof Star;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={actionStyles.button}>
      <Icon size={20} color='#6B7280' />
      <Text style={actionStyles.label}>{label}</Text>
    </Pressable>
  );
}

const actionStyles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  mapPreview: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  challengeText: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  challengeSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
