import { useMemo, useRef, useState } from 'react';
import type { ListRenderItem } from 'react-native';

import { useChallenges } from './useChallenges';
import { ChallengeCard } from '../components/ChallengeCard';
import type { ChallengeDetailSheetRef } from '../components/ChallengeDetailSheet';
import { FeaturedChallengeCard } from '../components/FeaturedChallengeCard';
import type { Challenge, ChallengeFilter } from '../types/challenges.types';

export function useChallengesViewModel() {
  const [activeFilter, setActiveFilter] = useState<ChallengeFilter>('all');
  const { data: challenges, isPending } = useChallenges(activeFilter);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const sheetRef = useRef<ChallengeDetailSheetRef>(null);

  const handleChallengePress = useMemo(
    () => (challenge: Challenge) => {
      setSelectedChallenge(challenge);
      requestAnimationFrame(() => {
        sheetRef.current?.open();
      });
    },
    []
  );

  const handleAccept = useMemo(
    () => (challenge: Challenge) => {
      console.log('[Challenge] Accepted:', challenge.id);
    },
    []
  );

  const handleViewRoute = useMemo(
    () => (challenge: Challenge) => {
      console.log('[Challenge] View route:', challenge.id);
    },
    []
  );

  const handleSheetClose = useMemo(
    () => () => {
      setSelectedChallenge(null);
    },
    []
  );

  const renderItem: ListRenderItem<Challenge> = useMemo(
    () =>
      ({ item }) => {
        if (item.isFeatured) {
          return (
            <FeaturedChallengeCard
              challenge={item}
              onPress={handleChallengePress}
              onAccept={handleAccept}
            />
          );
        }
        return (
          <ChallengeCard challenge={item} onPress={handleChallengePress} />
        );
      },
    [handleChallengePress, handleAccept]
  );

  const keyExtractor = useMemo(() => (item: Challenge) => item.id, []);

  const isEmpty = !challenges || challenges.length === 0;

  const isLoading = isPending && isEmpty;

  return {
    challenges,
    isPending,
    activeFilter,
    setActiveFilter,
    selectedChallenge,
    sheetRef,
    handleAccept,
    handleViewRoute,
    handleSheetClose,
    renderItem,
    keyExtractor,
    isEmpty,
    isLoading,
  };
}
