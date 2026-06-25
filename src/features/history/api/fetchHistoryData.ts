import { apiClient } from '@api/client';

import type {
  HistoryChallenge,
  HistoryProfile,
  RunHistoryItem,
} from '../types/history.types';

const MOCK_PROFILE: HistoryProfile = {
  handle: '@runner_alex',
  initials: 'A',
  totalRuns: 47,
  totalDistance: 342,
  challengesWon: 12,
};

const MOCK_RUNS: RunHistoryItem[] = [
  {
    id: 'r1',
    routeCoordinates: [
      [-8.839, 13.234],
      [-8.841, 13.237],
      [-8.843, 13.235],
      [-8.845, 13.238],
      [-8.842, 13.241],
      [-8.839, 13.239],
    ],
    dateLabel: 'Today',
    startTime: '06:30',
    areaName: 'Samba',
    distance: 6.4,
    elapsedTime: 1935,
    avgPace: 302,
    elevationGain: 45,
    challengeId: 'c1',
    challengeTitle: 'Samba Loop Challenge',
    placement: 3,
  },
  {
    id: 'r2',
    routeCoordinates: [
      [-8.899, 13.201],
      [-8.901, 13.204],
      [-8.903, 13.202],
      [-8.9, 13.199],
    ],
    dateLabel: 'Yesterday',
    startTime: '06:30',
    areaName: 'Talatona',
    distance: 5.2,
    elapsedTime: 1720,
    avgPace: 331,
    elevationGain: 22,
  },
  {
    id: 'r3',
    routeCoordinates: [
      [-8.826, 13.238],
      [-8.828, 13.24],
      [-8.831, 13.239],
      [-8.833, 13.242],
      [-8.83, 13.244],
    ],
    dateLabel: 'Mon, Jun 15',
    startTime: '06:30',
    areaName: 'Miramar',
    distance: 8.1,
    elapsedTime: 3920,
    avgPace: 484,
    elevationGain: 68,
    challengeId: 'c3',
    challengeTitle: 'Miramar Coastal',
    placement: 5,
  },
  {
    id: 'r4',
    routeCoordinates: [
      [-8.813, 13.228],
      [-8.815, 13.23],
      [-8.818, 13.229],
      [-8.816, 13.232],
    ],
    dateLabel: 'Sun, Jun 14',
    startTime: '07:15',
    areaName: 'Marginal',
    distance: 4.0,
    elapsedTime: 1330,
    avgPace: 333,
    elevationGain: 12,
  },
  {
    id: 'r5',
    routeCoordinates: [
      [-8.76, 13.215],
      [-8.762, 13.218],
      [-8.765, 13.216],
      [-8.763, 13.22],
      [-8.76, 13.217],
    ],
    dateLabel: 'Sat, Jun 13',
    startTime: '05:45',
    areaName: 'Ilha do Cabo',
    distance: 7.5,
    elapsedTime: 2330,
    avgPace: 311,
    elevationGain: 34,
  },
  {
    id: 'r6',
    routeCoordinates: [
      [-8.978, 13.13],
      [-8.98, 13.133],
      [-8.983, 13.131],
      [-8.981, 13.135],
      [-8.978, 13.132],
    ],
    dateLabel: 'Fri, Jun 12',
    startTime: '06:00',
    areaName: 'Benfica',
    distance: 10.2,
    elapsedTime: 3330,
    avgPace: 326,
    elevationGain: 82,
    challengeId: 'c4',
    challengeTitle: 'Benfica Trail Run',
    placement: 1,
  },
];

const MOCK_CHALLENGES: HistoryChallenge[] = [
  {
    id: 'h1',
    title: 'Samba Night Run',
    status: 'active',
    participantCount: 45,
    endsAt: '2026-07-20T23:59:59Z',
    role: 'created',
  },
  {
    id: 'h2',
    title: 'Marginal Morning Mile',
    status: 'completed',
    participantCount: 128,
    role: 'created',
  },
  {
    id: 'h3',
    title: 'Samba Loop Challenge',
    status: 'active',
    participantCount: 128,
    endsAt: '2026-07-15T23:59:59Z',
    role: 'participated',
  },
  {
    id: 'h4',
    title: 'Miramar Coastal',
    status: 'active',
    participantCount: 42,
    endsAt: '2026-07-25T23:59:59Z',
    role: 'participated',
  },
  {
    id: 'h5',
    title: 'Benfica Trail Run',
    status: 'completed',
    participantCount: 31,
    role: 'participated',
  },
];

export async function fetchProfile(): Promise<HistoryProfile> {
  const { data } = await apiClient.get<HistoryProfile>('/api/profile');
  return data;
}

export async function fetchRunHistory(): Promise<RunHistoryItem[]> {
  const { data } = await apiClient.get<RunHistoryItem[]>('/api/runs/history');
  return data;
}

export async function fetchHistoryChallenges(): Promise<HistoryChallenge[]> {
  const { data } = await apiClient.get<HistoryChallenge[]>(
    '/api/challenges/mine'
  );
  return data;
}

export function getMockProfile(): HistoryProfile {
  return MOCK_PROFILE;
}

export function getMockRunHistory(): RunHistoryItem[] {
  return MOCK_RUNS;
}

export function getMockHistoryChallenges(): HistoryChallenge[] {
  return MOCK_CHALLENGES;
}
