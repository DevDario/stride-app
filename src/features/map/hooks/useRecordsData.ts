import { useEffect, useRef, useState } from 'react';

import type { RecordEntry } from '../types/map.types';

export function useRecordsData(enabled: boolean) {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!enabled || hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);

    // TODO: replace with real API call when records backend is ready
    const timer = setTimeout(() => {
      setRecords([]);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [enabled]);

  return { records, isLoading };
}
