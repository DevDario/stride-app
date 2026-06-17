import axios from 'axios';

const OSRM_BASE_URL = 'https://router.project-osrm.org';

export const osrmClient = axios.create({
  baseURL: OSRM_BASE_URL,
  timeout: 15000,
});

export interface RouteResponse {
  code: string;
  routes: {
    geometry: {
      coordinates: [number, number][];
      type: 'LineString';
    };
    distance: number;
    duration: number;
    legs: {
      steps: unknown[];
      distance: number;
      duration: number;
      summary: string;
    }[];
  }[];
  waypoints: {
    name: string;
    location: [number, number];
  }[];
}

export interface GeocodeResponse {
  features: {
    id: string;
    place_name: string;
    center: [number, number];
    text: string;
  }[];
}

export async function fetchRoute(
  start: [number, number],
  end: [number, number]
): Promise<RouteResponse> {
  const { data } = await osrmClient.get<RouteResponse>(
    `/route/v1/running/${start[0]},${start[1]};${end[0]},${end[1]}`,
    { params: { geometries: 'geojson', overview: 'full' } }
  );
  return data;
}

export async function geocode(query: string): Promise<GeocodeResponse> {
  const { data } = await osrmClient.get<GeocodeResponse>('/geocode/v1/search', {
    params: { q: query, format: 'json' },
  });
  return data;
}
