import { useUser } from '@clerk/expo';
import { useMemo, useRef, useState } from 'react';

import {
  useHistoryChallenges,
  useProfile,
  useRunHistory,
} from './useHistoryData';
import { MiniChallengeCard } from '../components/MiniChallengeCard';
import type { RunDetailSheetRef } from '../components/RunDetailSheet';
import { RunHistoryItemCard } from '../components/RunHistoryItemCard';
import type {
  HistoryChallenge,
  HistoryChallengeFilter,
  RunHistoryItem,
} from '../types/history.types';

function filterChallenges(
  challenges: HistoryChallenge[],
  filter: HistoryChallengeFilter
): HistoryChallenge[] {
  return challenges.filter((c) => c.role === filter);
}

export function useHistoryViewModel() {
  const { user: clerkUser } = useUser();
  const { data: profile, isPending: profileLoading } = useProfile();
  const { data: runs, isPending: runsLoading } = useRunHistory();
  const { data: challenges, isPending: challengesLoading } =
    useHistoryChallenges();

  const [activeFilter, setActiveFilter] =
    useState<HistoryChallengeFilter>('created');
  const [selectedRun, setSelectedRun] = useState<RunHistoryItem | null>(null);
  const sheetRef = useRef<RunDetailSheetRef>(null);

  const clerkName = clerkUser?.firstName ?? clerkUser?.username ?? null;
  const clerkInitial =
    (
      clerkUser?.firstName?.[0] ??
      clerkUser?.username?.[0] ??
      null
    )?.toUpperCase() ?? null;
  const clerkAvatar = clerkUser?.imageUrl ?? null;
  const isEmailVerified =
    clerkUser?.primaryEmailAddress?.verification?.status === 'verified';

  const profileData = useMemo(() => {
    if (!profile) return null;
    return {
      ...profile,
      handle: clerkName ? `@${clerkName.toLowerCase()}` : profile.handle,
      initials: clerkInitial ?? profile.initials,
      avatarUrl: clerkAvatar,
    };
  }, [profile, clerkName, clerkInitial, clerkAvatar]);

  const filteredChallenges = useMemo(
    () => filterChallenges(challenges ?? [], activeFilter),
    [challenges, activeFilter]
  );

  const handleRunPress = useMemo(
    () => (run: RunHistoryItem) => {
      setSelectedRun(run);
      requestAnimationFrame(() => {
        sheetRef.current?.open();
      });
    },
    []
  );

  const handleSheetClose = useMemo(
    () => () => {
      setSelectedRun(null);
    },
    []
  );

  const renderRunItem = useMemo(
    () => (run: RunHistoryItem) => (
      <RunHistoryItemCard key={run.id} run={run} onPress={handleRunPress} />
    ),
    [handleRunPress]
  );

  const renderChallengeItem = useMemo(
    () => (challenge: HistoryChallenge) => (
      <MiniChallengeCard key={challenge.id} challenge={challenge} />
    ),
    []
  );

  const isLoading = profileLoading || runsLoading || challengesLoading;

  return {
    profile: profileData,
    isEmailVerified,
    runs,
    challenges: filteredChallenges,
    activeFilter,
    setActiveFilter,
    selectedRun,
    sheetRef,
    handleRunPress,
    handleSheetClose,
    renderRunItem,
    renderChallengeItem,
    isLoading,
  };
}
