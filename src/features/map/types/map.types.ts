export type LayerKey = 'areaRatings' | 'challenges' | 'routes' | 'records';

export type RunState = 'idle' | 'running' | 'paused' | 'finished';

export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
}

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

export interface AreaOverlayLabel {
  areaId: string;
  name: string;
  rating: number;
  breakdown: { safety: number; vibe: number; crowd: number };
  centroid: [number, number];
  visible: boolean;
}
