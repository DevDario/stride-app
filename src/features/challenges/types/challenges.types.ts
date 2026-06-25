export type ChallengeFilter = 'all' | 'nearby' | 'endingSoon' | 'mostPopular';

export interface ChallengeParticipant {
  id: string;
  handle: string;
  avatarUrl?: string;
  time?: string;
  isLeader?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  creatorHandle: string;
  description?: string;
  distance: number;
  timeGoal: string;
  participantCount: number;
  location?: string;
  isFeatured: boolean;
  routeCoordinates: [number, number][];
  endsAt?: string;
  status: 'active' | 'upcoming' | 'completed';
  distanceFromUser: number | null;
  topParticipants?: ChallengeParticipant[];
  totalParticipants?: number;
}
