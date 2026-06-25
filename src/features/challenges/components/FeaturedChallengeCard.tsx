import { Users } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RouteSparkline } from './RouteSparkline';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import type { Challenge } from '../types/challenges.types';

interface FeaturedChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
  onAccept: (challenge: Challenge) => void;
}

export const FeaturedChallengeCard = React.memo(function FeaturedChallengeCard({
  challenge,
  onPress,
  onAccept,
}: FeaturedChallengeCardProps) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(challenge)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.md,
        },
      ]}
    >
      <Badge label='FEATURED' color='primary' />

      <View style={[styles.sparklineContainer, { marginTop: spacing.sm }]}>
        <RouteSparkline
          coordinates={challenge.routeCoordinates}
          width={280}
          height={64}
        />
      </View>

      <Text variant='title-md' style={[styles.title, { color: colors.text }]}>
        {challenge.title}
      </Text>

      <Text
        variant='body-sm'
        style={{ color: colors.textSecondary, marginTop: 2 }}
      >
        {challenge.creatorHandle}
      </Text>

      <View style={[styles.statsRow, { marginTop: spacing.sm }]}>
        <View style={styles.stat}>
          <Text variant='label' style={{ color: colors.text }}>
            {challenge.distance} km
          </Text>
          <Text variant='body-sm' style={{ color: colors.textSecondary }}>
            Distance
          </Text>
        </View>

        <View style={styles.stat}>
          <Text variant='label' style={{ color: colors.text }}>
            {challenge.timeGoal}
          </Text>
          <Text variant='body-sm' style={{ color: colors.textSecondary }}>
            Time Goal
          </Text>
        </View>

        <View style={styles.stat}>
          <View style={styles.participantsRow}>
            <Users size={14} color={colors.textSecondary} />
            <Text variant='label' style={{ color: colors.text }}>
              {challenge.participantCount}
            </Text>
          </View>
          <Text variant='body-sm' style={{ color: colors.textSecondary }}>
            Runners
          </Text>
        </View>
      </View>

      <Button
        title='Accept Challenge'
        variant='primary'
        onPress={() => onAccept(challenge)}
        className='mt-3'
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sparklineContainer: {
    alignItems: 'center',
  },
  title: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'flex-start',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
