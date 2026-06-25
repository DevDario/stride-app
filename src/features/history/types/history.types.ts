export interface HistoryProfile {
  handle: string;
  initials: string;
  avatarUrl?: string;
  totalRuns: number;
  totalDistance: number;
  challengesWon: number;
}

export interface RunHistoryItem {
  id: string;
  routeCoordinates: [number, number][];
  dateLabel: string;
  startTime: string;
  areaName: string;
  distance: number;
  elapsedTime: number;
  avgPace: number;
  elevationGain: number;
  challengeId?: string;
  challengeTitle?: string;
  placement?: number;
}

export type HistoryChallengeFilter = 'created' | 'participated';

export interface HistoryChallenge {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'upcoming';
  participantCount: number;
  endsAt?: string;
  role: 'created' | 'participated';
}
