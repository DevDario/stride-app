import { useQuery } from '@tanstack/react-query';

import {
  getMockHistoryChallenges,
  getMockProfile,
  getMockRunHistory,
} from '../api/fetchHistoryData';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getMockProfile(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockProfile(),
  });
}

export function useRunHistory() {
  return useQuery({
    queryKey: ['runHistory'],
    queryFn: () => getMockRunHistory(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockRunHistory(),
  });
}

export function useHistoryChallenges() {
  return useQuery({
    queryKey: ['historyChallenges'],
    queryFn: () => getMockHistoryChallenges(),
    staleTime: 5 * 60 * 1000,
    placeholderData: getMockHistoryChallenges(),
  });
}
