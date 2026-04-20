import { useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, View } from 'react-native'
import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { useOnboardingStore, type RunSchedule } from '@store/onboardingStore'
import { cn } from '@utils/cn'

const SCHEDULES: { value: RunSchedule; label: string; time: string; illustration: number }[] = [
    {
        value: 'morning_run',
        label: 'Morning Run',
        time: '5AM – 9AM',
        illustration: require('../../assets/illustrations/morning.png'),
    },
    {
        value: 'midday_mile',
        label: 'Midday Mile',
        time: '11AM – 2PM',
        illustration: require('../../assets/illustrations/midday.png'),
    },
    {
        value: 'afternoon_session',
        label: 'Afternoon Session',
        time: '3PM – 6PM',
        illustration: require('../../assets/illustrations/afternoon.png'),
    },
    {
        value: 'evening_run',
        label: 'Evening Run',
        time: '6PM – 9PM',
        illustration: require('../../assets/illustrations/evening.png'),
    },
    {
        value: 'night_session',
        label: 'Night Session',
        time: '9PM – 12AM',
        illustration: require('../../assets/illustrations/night.png'),
    },
    {
        value: 'night_owl',
        label: 'Night Owl',
        time: '12AM+',
        illustration: require('../../assets/illustrations/nightowl.png'),
    },
]


function ActiveIllustration({ selected }: { selected: RunSchedule[] }) {
    const last = selected[selected.length - 1]
    const match = SCHEDULES.find((s) => s.value === last)
    if (!match) return <View className="w-full h-48 bg-neutral-100 rounded-xl" />
    return (
        <Image
            source={match.illustration}
            className="w-full h-48 rounded-xl"
            resizeMode="cover"
        />
    )
}

export default function ScheduleScreen() {
    const router = useRouter()
    const { profile, toggleSchedule } = useOnboardingStore()
    const selected = profile.preferredSchedules

    return (
        <View className="flex-1 bg-neutral-0 pt-16 pb-12">
            <View className="px-6 gap-6 flex-1">
                <Text variant="title-lg">When do you love to run?</Text>

                <ActiveIllustration selected={selected} />

                <ScrollView
                    contentContainerClassName="flex-row flex-wrap items-center justify-center gap-2" scrollEnabled={false}>
                    {SCHEDULES.map((s) => {
                        const active = selected.includes(s.value)
                        return (
                            <Pressable
                                key={s.value}
                                onPress={() => toggleSchedule(s.value)}
                                className={cn(
                                    'px-4 py-2 rounded-full border',
                                    active
                                        ? 'bg-primary-500 border-primary-500'
                                        : 'bg-neutral-0 border-neutral-200',
                                )}
                            >
                                <Text
                                    variant="label"
                                    className={active ? 'text-neutral-0' : 'text-neutral-700'}
                                >
                                    {s.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            <View className="px-6 mt-4">
                <Button
                    title="Next"
                    onPress={() => router.push('/(setup)/level')}
                    disabled={selected.length === 0}
                />
            </View>
        </View>
    )
}