import { useEffect } from 'react'
import { useUser } from '@clerk/expo'
import { useHomeStore } from '../store/homeStore';

export const useHomeViewModel = () => {
  const { user: clerkUser, isLoaded } = useUser()
  const { user, isLoading, setUser, setIsLoading } = useHomeStore();

  useEffect(() => {
    setIsLoading(!isLoaded)

    if (isLoaded && clerkUser) {
      const runnerProfile = clerkUser.unsafeMetadata?.runnerProfile as any

      setUser({
        name: clerkUser.firstName ?? 'Runner',
        level: runnerProfile?.level ?? 'Beginner',
        avatarUrl: clerkUser.imageUrl,
        onboardingComplete: !!clerkUser.unsafeMetadata?.onboardingComplete,
        preferredSchedules: runnerProfile?.preferredSchedules || [],
      })
    } else if (isLoaded && !clerkUser) {
      setUser(null)
    }
  }, [isLoaded, clerkUser])

  return {
    greeting: user ? `Ready to get moving?` : 'Welcome to Stride!',
    user,
    isLoading,
  };
};
