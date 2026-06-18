import type { LucideIcon } from 'lucide-react-native';
import { FlagTriangleRight, Route, Trophy } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'src/theme/ThemeProvider';

import type { LayerKey } from '../types/map.types';

interface PillDefinition {
  key: LayerKey;
  label: string;
  Icon?: LucideIcon;
}

const PILLS: PillDefinition[] = [
  { key: 'areaRatings', label: 'Area Ratings' },
  { key: 'challenges', label: 'Challenges', Icon: FlagTriangleRight },
  { key: 'routes', label: 'My Routes', Icon: Route },
  { key: 'records', label: 'Records', Icon: Trophy },
];

interface MapLayersBottomSheetProps {
  activeLayers: Set<LayerKey>;
  onToggle: (layer: LayerKey) => void;
}

export function MapLayersBottomSheet({
  activeLayers,
  onToggle,
}: MapLayersBottomSheetProps) {
  const { colors, radii } = useTheme();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 400 });
    opacity.value = withTiming(1, { duration: 400 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          paddingBottom: insets.bottom + 8,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: radii.lg,
          borderTopRightRadius: radii.lg,
        },
      ]}
    >
      <View style={styles.handleRow}>
        <View style={[styles.handle, { backgroundColor: '#D4D4D4' }]} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
      >
        {PILLS.map((pill) => {
          const isActive = activeLayers.has(pill.key);
          return (
            <Pill
              key={pill.key}
              label={pill.label}
              Icon={pill.Icon}
              isActive={isActive}
              primaryColor={colors.primary}
              onPress={() => onToggle(pill.key)}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

function Pill({
  label,
  Icon,
  isActive,
  primaryColor,
  onPress,
}: {
  label: string;
  Icon?: LucideIcon;
  isActive: boolean;
  primaryColor: string;
  onPress: () => void;
}) {
  const pillStyle = useMemo(
    () => ({
      backgroundColor: isActive ? primaryColor : '#F7F7F7',
    }),
    [isActive, primaryColor]
  );

  const iconColor = isActive ? '#FFFFFF' : '#AFAFAF';
  const textColor = isActive ? '#FFFFFF' : '#AFAFAF';

  return (
    <Pressable onPress={onPress} style={[styles.pill, pillStyle]}>
      {Icon && <Icon size={18} color={iconColor} />}
      <Text style={[styles.pillLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
