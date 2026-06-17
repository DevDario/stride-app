import { useQuery } from '@tanstack/react-query';

import { getMockChallenges } from '../api/fetchNearbyChallenges';
import type { NearbyChallengesParams } from '../types';

export function useNearbyChallenges(params: NearbyChallengesParams) {
  return useQuery({
    queryKey: ['nearbyChallenges', params],
    queryFn: () => getMockChallenges(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockChallenges(),
  });
}
