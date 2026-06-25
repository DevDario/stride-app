import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import type { ChallengeFilter } from '../types/challenges.types';

const FILTER_OPTIONS: { key: ChallengeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'nearby', label: 'Nearby' },
  { key: 'endingSoon', label: 'Ending Soon' },
  { key: 'mostPopular', label: 'Most Popular' },
];

interface FilterChipsProps {
  activeFilter: ChallengeFilter;
  onSelect: (filter: ChallengeFilter) => void;
}

export function FilterChips({ activeFilter, onSelect }: FilterChipsProps) {
  const { colors, radii } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.key;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            style={[
              styles.chip,
              {
                borderRadius: radii.full,
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              variant='label'
              style={{
                color: isActive ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
});
