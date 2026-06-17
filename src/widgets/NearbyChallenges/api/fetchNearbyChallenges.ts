import { apiClient } from '@api/client';

import type { NearbyChallenge, NearbyChallengesParams } from '../types';

const MOCK_CHALLENGES: NearbyChallenge[] = [
  {
    id: '1',
    name: 'Samba Loop',
    creatorUsername: '@devdario',
    location: 'Samba',
    timeToBeat: '10:24',
    distance: '10km',
  },
  {
    id: '2',
    name: 'Marginal Sunrise',
    creatorUsername: '@carla_runs',
    location: 'Marginal',
    timeToBeat: '08:15',
    distance: '8km',
  },
  {
    id: '3',
    name: 'Ilha Sprint',
    creatorUsername: '@joao_fit',
    location: 'Ilha do Cabo',
    timeToBeat: '12:30',
    distance: '12km',
  },
  {
    id: '4',
    name: 'Benfica Trail',
    creatorUsername: '@ana_running',
    location: 'Benfica',
    timeToBeat: '15:00',
    distance: '15km',
  },
  {
    id: '5',
    name: 'Mussulo Dash',
    creatorUsername: '@pedro_run',
    location: 'Mussulo',
    timeToBeat: '09:45',
    distance: '7km',
  },
  {
    id: '6',
    name: 'Kilamba Ridge',
    creatorUsername: '@luisa_run',
    location: 'Kilamba',
    timeToBeat: '11:20',
    distance: '11km',
  },
];

export async function fetchNearbyChallenges(
  _params: NearbyChallengesParams
): Promise<NearbyChallenge[]> {
  const { data } = await apiClient.get<NearbyChallenge[]>(
    '/api/challenges/nearby',
    { params: _params }
  );
  return data;
}

export function getMockChallenges(): NearbyChallenge[] {
  return MOCK_CHALLENGES;
}
