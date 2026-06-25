import { Users, Clock } from 'lucide-react-native';
import { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import { Badge } from '../../../components/Badge';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import type { HistoryChallenge } from '../types/history.types';

interface MiniChallengeCardProps {
  challenge: HistoryChallenge;
}

function getDaysLeft(endsAt?: string): string {
  if (!endsAt) return '';
  const remaining = new Date(endsAt).getTime() - Date.now();
  if (remaining <= 0) return 'Ended';
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  return `${days}d left`;
}

export const MiniChallengeCard = memo(function MiniChallengeCard({
  challenge,
}: MiniChallengeCardProps) {
  const { colors, radii, spacing } = useTheme();

  const statusBadge = {
    active: 'primary' as const,
    completed: 'secondary' as const,
    upcoming: 'danger' as const,
  };

  return (
    <View
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
      <View style={styles.row}>
        <View style={styles.info}>
          <Text
            variant='body'
            className='font-sans-semi'
            style={{ color: colors.text }}
          >
            {challenge.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Users size={14} color={colors.textSecondary} />
              <Text variant='body-sm' style={{ color: colors.textSecondary }}>
                {challenge.participantCount}
              </Text>
            </View>
            {challenge.endsAt && (
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.textSecondary} />
                <Text variant='body-sm' style={{ color: colors.textSecondary }}>
                  {getDaysLeft(challenge.endsAt)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Badge label={challenge.status} color={statusBadge[challenge.status]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
