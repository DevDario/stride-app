import { apiClient } from '@api/client';

import type { RunHistoryRecord } from '../types';

const MOCK_RUNS: RunHistoryRecord[] = [
  {
    id: '1',
    duration: '32:15',
    dayLabel: 'Today',
    startTime: '5:00 PM',
    distance: '6.4 km',
    finishTime: '5:32 PM',
  },
  {
    id: '2',
    duration: '28:40',
    dayLabel: 'Yesterday',
    startTime: '6:30 AM',
    distance: '5.2 km',
    finishTime: '6:58 AM',
  },
  {
    id: '3',
    duration: '1:05:20',
    dayLabel: 'Mon, Jun 15',
    startTime: '4:20 AM',
    distance: '8.1 km',
    finishTime: '5:05 AM',
  },
  {
    id: '4',
    duration: '22:10',
    dayLabel: 'Sun, Jun 14',
    startTime: '7:15 PM',
    distance: '4.0 km',
    finishTime: '7:37 PM',
  },
  {
    id: '5',
    duration: '38:50',
    dayLabel: 'Sat, Jun 13',
    startTime: '5:45 AM',
    distance: '7.5 km',
    finishTime: '6:23 AM',
  },
];

export async function fetchRecentRuns(): Promise<RunHistoryRecord[]> {
  const { data } = await apiClient.get<RunHistoryRecord[]>('/api/runs/recent');
  return data;
}

export function getMockRuns(): RunHistoryRecord[] {
  return MOCK_RUNS;
}
