import { MapPin, Users } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RouteSparkline } from './RouteSparkline';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import type { Challenge } from '../types/challenges.types';

function getTimeRemaining(endsAt?: string): string | null {
  if (!endsAt) return null;
  const remaining = new Date(endsAt).getTime() - Date.now();
  if (remaining <= 0) return 'Ended';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  if (hours < 1) return '<1h';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''}`;
  return `${Math.floor(days / 30)}mo`;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
}

export const ChallengeCard = React.memo(function ChallengeCard({
  challenge,
  onPress,
}: ChallengeCardProps) {
  const { colors, spacing, radii } = useTheme();
  const timeRemaining = getTimeRemaining(challenge.endsAt);
  const statusColor =
    challenge.status === 'active' ? colors.primary : colors.textSecondary;

  return (
    <Pressable
      onPress={() => onPress(challenge)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          borderColor: colors.border,
          padding: spacing.sm,
        },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.thumbnail,
            {
              borderRadius: radii.sm,
              backgroundColor: colors.background,
            },
          ]}
        >
          <RouteSparkline
            coordinates={challenge.routeCoordinates}
            width={56}
            height={56}
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.content}>
          <Text
            variant='body-lg'
            className='font-semibold'
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {challenge.title}
          </Text>

          <View style={[styles.statsLine, { marginTop: 4 }]}>
            <Text variant='body-sm' style={{ color: colors.textSecondary }}>
              {challenge.distance} km
            </Text>
            <View
              style={[styles.dot, { backgroundColor: colors.textSecondary }]}
            />
            <Text variant='body-sm' style={{ color: colors.textSecondary }}>
              {challenge.timeGoal}
            </Text>
            <View
              style={[styles.dot, { backgroundColor: colors.textSecondary }]}
            />
            <Users size={12} color={colors.textSecondary} />
            <Text variant='body-sm' style={{ color: colors.textSecondary }}>
              {challenge.participantCount}
            </Text>
          </View>

          {challenge.distanceFromUser !== null && (
            <View style={[styles.locationRow, { marginTop: 4 }]}>
              <MapPin size={12} color={colors.textSecondary} />
              <Text variant='body-sm' style={{ color: colors.textSecondary }}>
                {challenge.distanceFromUser.toFixed(1)} km away
              </Text>
            </View>
          )}
        </View>

        <View style={styles.right}>
          {timeRemaining && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: statusColor,
                  borderRadius: radii.full,
                },
              ]}
            >
              <Text
                variant='body-sm'
                className='font-sans-semi'
                style={{ color: '#FFFFFF', fontSize: 11 }}
              >
                {timeRemaining}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  statsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  right: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
