import { useEffect, useRef, useState } from 'react';

import type { ChallengeMarker } from '../types/map.types';

const MOCK_CHALLENGES: ChallengeMarker[] = [
  {
    id: 'challenge-1',
    name: 'Marginal Sprint',
    coordinate: [13.235, -8.83],
  },
  {
    id: 'challenge-2',
    name: 'Ilha Trail',
    coordinate: [13.248, -8.806],
  },
  {
    id: 'challenge-3',
    name: 'Maianga Loop',
    coordinate: [13.223, -8.881],
  },
];

export function useChallengesData(enabled: boolean) {
  const [challenges, setChallenges] = useState<ChallengeMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!enabled || hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      setChallenges(MOCK_CHALLENGES);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [enabled]);

  return { challenges, isLoading };
}
