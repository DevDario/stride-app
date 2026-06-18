export type LayerKey = 'areaRatings' | 'challenges' | 'routes' | 'records';

export interface ChallengeMarker {
  id: string;
  name: string;
  coordinate: [number, number];
}

export interface RouteRecord {
  id: string;
  name: string;
}

export interface RecordEntry {
  id: string;
  label: string;
}
