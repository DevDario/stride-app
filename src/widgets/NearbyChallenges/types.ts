export interface NearbyChallenge {
  id: string;
  name: string;
  creatorUsername: string;
  location: string;
  timeToBeat: string;
  distance: string;
}

export interface NearbyChallengesParams {
  lat: number;
  lng: number;
  radiusKm: number;
}
