import { useUser } from '@clerk/expo';
import { useOnboardingStore } from '@store/onboardingStore';
import { useRouter } from 'expo-router';

import { upsertProfile } from '../services/supabase/profiles';

export function useOnboardingComplete() {
  const { user } = useUser();
  const router = useRouter();
  const { profile, reset } = useOnboardingStore();

  async function complete() {
    if (!user) return;

    await user.update({
      firstName: profile.name.split(' ')[0] ?? profile.name,
      lastName: profile.name.split(' ').slice(1).join(' ') || undefined,
      unsafeMetadata: {
        onboardingComplete: true,
        runnerProfile: {
          birthDate: profile.birthDate,
          gender: profile.gender,
          weeklyFrequency: profile.weeklyFrequency,
          preferredSchedules: profile.preferredSchedules,
          level: profile.level,
        },
      },
    });

    try {
      await upsertProfile(user, profile);
    } catch (error) {
      console.warn('[profiles] upsert failed', error);
    }

    reset();
    router.replace('/(tabs)/home');
  }

  return { complete, profile };
}
