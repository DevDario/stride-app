import { useEffect, useRef, useState } from 'react';

import type { RouteRecord } from '../types/map.types';

export function useRoutesData(enabled: boolean) {
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!enabled || hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);

    // TODO: replace with real API call when routes backend is ready
    const timer = setTimeout(() => {
      setRoutes([]);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [enabled]);

  return { routes, isLoading };
}
