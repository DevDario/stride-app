import type { OnboardingProfile } from '@store/onboardingStore';

import { supabase } from './client';

interface ProfileOwner {
  id: string;
}

export async function upsertProfile(
  user: ProfileOwner,
  profile: OnboardingProfile
) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      handle: `runner_${user.id.slice(-8)}`,
      display_name: profile.name,
      gender: profile.gender,
      birth_date: profile.birthDate,
      weekly_frequency: profile.weeklyFrequency,
      preferred_schedules: profile.preferredSchedules,
      level: profile.level,
    },
    { onConflict: 'id' }
  );

  if (error) throw error;
}
