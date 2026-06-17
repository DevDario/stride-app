import { useQuery } from '@tanstack/react-query';

import { getMockRuns } from '../api/fetchRecentRuns';

export function useRecentRuns() {
  return useQuery({
    queryKey: ['recentRuns'],
    queryFn: () => getMockRuns(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockRuns(),
  });
}
