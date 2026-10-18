import { useAuth } from '@clerk/expo';
import { useMemo } from 'react';

import { setSupabaseTokenGetter } from './client';

export function SupabaseAuthBridge() {
  const { getToken } = useAuth();

  useMemo(() => setSupabaseTokenGetter(getToken), [getToken]);

  return null;
}
