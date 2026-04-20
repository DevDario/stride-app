import { create } from 'zustand'

export type RunSchedule =
   | 'morning_run'
   | 'midday_mile'
   | 'afternoon_session'
   | 'evening_run'
   | 'night_session'
   | 'night_owl'

export type RunnerLevel = 'beginner' | 'casual' | 'regular' | 'competitive'

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say'

interface OnboardingProfile {
   name: string
   birthDate: string | null
   gender: Gender | null
   weeklyFrequency: number
   preferredSchedules: RunSchedule[]
   level: RunnerLevel | null
}

interface OnboardingState {
   profile: OnboardingProfile
   setName: (name: string) => void
   setBirthDate: (date: string) => void
   setGender: (gender: Gender) => void
   setWeeklyFrequency: (freq: number) => void
   toggleSchedule: (schedule: RunSchedule) => void
   setLevel: (level: RunnerLevel) => void
   reset: () => void
}

const defaultProfile: OnboardingProfile = {
   name: '',
   birthDate: null,
   gender: null,
   weeklyFrequency: 3,
   preferredSchedules: [],
   level: null,
}


export const useOnboardingStore = create<OnboardingState>((set) => ({
   profile: defaultProfile,

   setName: (name) =>
      set((s) => ({ profile: { ...s.profile, name } })),

   setBirthDate: (birthDate) =>
      set((s) => ({ profile: { ...s.profile, birthDate } })),

   setGender: (gender) =>
      set((s) => ({ profile: { ...s.profile, gender } })),

   setWeeklyFrequency: (weeklyFrequency) =>
      set((s) => ({ profile: { ...s.profile, weeklyFrequency } })),

   toggleSchedule: (schedule) =>
      set((s) => {
         const current = s.profile.preferredSchedules
         const updated = current.includes(schedule)
            ? current.filter((x) => x !== schedule)
            : [...current, schedule]
         return { profile: { ...s.profile, preferredSchedules: updated } }
      }),

   setLevel: (level) =>
      set((s) => ({ profile: { ...s.profile, level } })),

   reset: () => set({ profile: defaultProfile }),
}))