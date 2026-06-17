import { useQuery } from '@tanstack/react-query';

import { getMockWeeklyResume } from '../api/fetchWeeklyResume';

export function useWeeklyRunsResume() {
  return useQuery({
    queryKey: ['weeklyRunsResume'],
    queryFn: () => getMockWeeklyResume(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockWeeklyResume(),
  });
}
