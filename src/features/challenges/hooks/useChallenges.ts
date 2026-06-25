import { useQuery } from '@tanstack/react-query';

import { getMockChallenges } from '../api/fetchChallenges';
import type { Challenge, ChallengeFilter } from '../types/challenges.types';

function filterChallenges(
  challenges: Challenge[],
  filter: ChallengeFilter
): Challenge[] {
  switch (filter) {
    case 'all':
      return challenges;
    case 'nearby':
      return challenges
        .filter((c) => c.distanceFromUser !== null)
        .sort(
          (a, b) =>
            (a.distanceFromUser ?? Infinity) - (b.distanceFromUser ?? Infinity)
        );
    case 'endingSoon':
      return challenges
        .filter((c) => c.endsAt)
        .sort(
          (a, b) =>
            new Date(a.endsAt!).getTime() - new Date(b.endsAt!).getTime()
        );
    case 'mostPopular':
      return [...challenges].sort(
        (a, b) => b.participantCount - a.participantCount
      );
    default:
      return challenges;
  }
}

export function useChallenges(filter: ChallengeFilter) {
  const query = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getMockChallenges(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockChallenges(),
  });

  const data = query.data ?? [];
  const featured = data.find((c) => c.isFeatured);
  const rest = filterChallenges(
    featured ? data.filter((c) => c.id !== featured.id) : data,
    filter
  );
  const filtered = featured ? [featured, ...rest] : rest;

  return {
    ...query,
    data: filtered,
    featured,
  };
}
