import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Crown, Medal, Users, ChevronDown } from 'lucide-react-native';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RouteSparkline } from './RouteSparkline';
import { Avatar } from '../../../components/Avatar';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import type {
  Challenge,
  ChallengeParticipant,
} from '../types/challenges.types';

interface ChallengeDetailSheetProps {
  challenge: Challenge | null;
  onClose: () => void;
  onAccept: (challenge: Challenge) => void;
  onViewRoute: (challenge: Challenge) => void;
}

export interface ChallengeDetailSheetRef {
  open: () => void;
}

function getDaysLeft(endsAt?: string): string {
  if (!endsAt) return '';
  const remaining = new Date(endsAt).getTime() - Date.now();
  if (remaining <= 0) return '0 days';
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? 's' : ''} left`;
}

interface LeaderboardRowProps {
  participant: ChallengeParticipant;
  rank: number;
  isLast?: boolean;
}

function LeaderboardRow({ participant, rank, isLast }: LeaderboardRowProps) {
  const { colors } = useTheme();

  const rankIcon =
    rank === 1 ? (
      <Crown size={18} color='#F59E0B' />
    ) : rank === 2 ? (
      <Medal size={18} color='#9CA3AF' />
    ) : rank === 3 ? (
      <Medal size={18} color='#D97706' />
    ) : (
      <Text variant='label' style={{ color: colors.textSecondary, width: 20 }}>
        {rank}
      </Text>
    );

  return (
    <View
      style={[
        rowStyles.container,
        { borderBottomColor: colors.border },
        isLast && rowStyles.last,
      ]}
    >
      <View style={rowStyles.rankCol}>{rankIcon}</View>

      <Avatar
        uri={participant.avatarUrl}
        initials={participant.handle[1]}
        size={32}
      />

      <View style={rowStyles.info}>
        <Text
          variant='body'
          className='font-sans-semi'
          style={{ color: colors.text }}
        >
          {participant.handle}
        </Text>
        {participant.isLeader && <Badge label='LEADER' color='primary' />}
      </View>

      {participant.time && (
        <Text variant='label' style={{ color: colors.text }}>
          {participant.time}
        </Text>
      )}
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  last: {
    borderBottomWidth: 0,
  },
  rankCol: {
    width: 24,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export const ChallengeDetailSheet = forwardRef<
  ChallengeDetailSheetRef,
  ChallengeDetailSheetProps
>(function ChallengeDetailSheet(
  { challenge, onClose, onAccept, onViewRoute },
  ref
) {
  const sheetRef = useRef<BottomSheet>(null);
  const { colors, spacing, radii } = useTheme();
  const [participantsExpanded, setParticipantsExpanded] = useState(false);

  const snapPoints = useMemo(() => ['60%', '85%'], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
  }));

  const handleAccept = useCallback(() => {
    if (challenge) onAccept(challenge);
  }, [challenge, onAccept]);

  const handleViewRoute = useCallback(() => {
    if (challenge) onViewRoute(challenge);
  }, [challenge, onViewRoute]);

  const visibleParticipants = useMemo(() => {
    if (!challenge?.topParticipants) return [];
    return participantsExpanded
      ? challenge.topParticipants
      : challenge.topParticipants.slice(0, 3);
  }, [challenge?.topParticipants, participantsExpanded]);

  const hasMoreParticipants =
    challenge &&
    challenge.topParticipants &&
    challenge.totalParticipants &&
    challenge.topParticipants.length < challenge.totalParticipants;

  const extraCount = challenge
    ? (challenge.totalParticipants ?? 0) -
      (participantsExpanded
        ? (challenge.topParticipants?.length ?? 0)
        : Math.min(challenge.topParticipants?.length ?? 0, 3))
    : 0;

  if (!challenge) return null;

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
          {challenge.title}
        </Text>

        <View style={[styles.creatorRow, { marginBottom: spacing.sm }]}>
          <Avatar initials={challenge.creatorHandle[1]} size={28} />
          <Text variant='body-sm' style={{ color: colors.textSecondary }}>
            {challenge.creatorHandle} created this
          </Text>
        </View>

        <View style={[styles.statusRow, { marginBottom: spacing.md }]}>
          <Badge
            label={`ACTIVE · ${getDaysLeft(challenge.endsAt)}`}
            color='primary'
          />
        </View>

        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              marginBottom: spacing.md,
            },
          ]}
        >
          <View style={styles.statsCardRow}>
            <View>
              <Text variant='title-md' style={{ color: colors.text }}>
                {challenge.distance} km
              </Text>
              <Text
                variant='label'
                style={{ color: colors.textSecondary, marginTop: 2 }}
              >
                Time Goal: {challenge.timeGoal}
              </Text>
            </View>
            <View
              style={[
                styles.routePreview,
                {
                  borderRadius: radii.sm,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <RouteSparkline
                coordinates={challenge.routeCoordinates}
                width={80}
                height={64}
                strokeWidth={3}
              />
            </View>
          </View>
        </View>

        <Text
          variant='title-sm'
          style={{ color: colors.text, marginBottom: spacing.sm }}
        >
          Top Runners
        </Text>

        {visibleParticipants.map((participant, index) => (
          <LeaderboardRow
            key={participant.id}
            participant={participant}
            rank={index + 1}
            isLast={index === visibleParticipants.length - 1 && extraCount <= 0}
          />
        ))}

        {!participantsExpanded && hasMoreParticipants && extraCount > 0 && (
          <Pressable
            onPress={() => setParticipantsExpanded(true)}
            style={[styles.expandRow, { borderBottomColor: colors.border }]}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Users size={16} color={colors.textSecondary} />
              <Text variant='body' style={{ color: colors.textSecondary }}>
                +{extraCount} more participant{extraCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <ChevronDown size={18} color={colors.textSecondary} />
          </Pressable>
        )}

        <View style={[styles.actions, { marginTop: spacing.md }]}>
          <Button
            title='Accept Challenge'
            variant='primary'
            onPress={handleAccept}
            className='w-full mb-2'
          />
          <Button
            title='View Full Route'
            variant='ghost'
            onPress={handleViewRoute}
            className='w-full'
          />
        </View>

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statsCard: {
    padding: 16,
  },
  statsCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routePreview: {
    width: 80,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actions: {
    gap: 8,
  },
});
