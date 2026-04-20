import { useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { useOnboardingStore } from '@store/onboardingStore'

export function useOnboardingComplete() {
   const { user } = useUser()
   const router = useRouter()
   const { profile, reset } = useOnboardingStore()

   async function complete() {
      if (!user) return

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
      })

      reset()
      router.replace('/(tabs)/home')
   }

   return { complete, profile }
}