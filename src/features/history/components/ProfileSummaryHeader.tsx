import { View, StyleSheet } from 'react-native';

import { Avatar } from '../../../components/Avatar';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import type { HistoryProfile } from '../types/history.types';

interface ProfileSummaryHeaderProps {
  profile: HistoryProfile;
}

function StatBlock({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={statStyles.block}>
      <Text variant='title-md' style={{ color: colors.text }}>
        {value}
      </Text>
      <Text variant='body-sm' style={{ color: colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: 2,
  },
});

export function ProfileSummaryHeader({ profile }: ProfileSummaryHeaderProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          marginBottom: spacing.sm,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.avatarRow}>
        <Avatar uri={profile.avatarUrl} initials={profile.initials} size={56} />
        <View style={styles.nameCol}>
          <Text variant='title-sm' style={{ color: colors.text }}>
            {profile.handle}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatBlock value={profile.totalRuns} label='Runs' />
        <StatBlock value={profile.totalDistance} label='km' />
        <StatBlock value={profile.challengesWon} label='Won' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  nameCol: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
});
