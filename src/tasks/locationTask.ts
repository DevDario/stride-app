import * as Location from 'expo-location';
import { defineTask } from 'expo-task-manager';

import { getRunSessionState } from '../features/map/run/RunSession';

export const LOCATION_TASK_NAME = 'stride-location-tracking';

defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;
  if (!data) return;

  const { locations } = data as { locations: Location.LocationObject[] };
  const session = getRunSessionState();

  if (session.state !== 'running') return;

  const lastLocation = locations[locations.length - 1];
  if (!lastLocation) return;

  session.addCoordinate({
    latitude: lastLocation.coords.latitude,
    longitude: lastLocation.coords.longitude,
    timestamp: lastLocation.timestamp,
  });
});
