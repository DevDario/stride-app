import { apiClient } from '@api/client';

import type { WeeklyRunSummary } from '../types';

const MOCK_SUMMARY: WeeklyRunSummary = {
  totalDistance: '34.90',
  percentageChange: 3.4,
  chartData: [
    { value: 50 },
    { value: 34 },
    { value: 45 },
    { value: 59 },
    { value: 64 },
    { value: 74 },
    { value: 78 },
    { value: 85 },
    { value: 93 },
  ],
  calories: 248,
  elevationGain: '6.4',
  avgPace: '7\'29"',
};

export async function fetchWeeklyResume(): Promise<WeeklyRunSummary> {
  const { data } = await apiClient.get<WeeklyRunSummary>(
    '/api/runs/weekly-summary'
  );
  return data;
}

export function getMockWeeklyResume(): WeeklyRunSummary {
  return MOCK_SUMMARY;
}
