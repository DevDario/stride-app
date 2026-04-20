import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { useOnboardingStore, type RunnerLevel } from '@store/onboardingStore'
import { cn } from '@utils/cn'

const LEVELS: { value: RunnerLevel; label: string; description: string }[] = [
    { value: 'beginner', label: 'Beginner', description: 'Just getting started' },
    { value: 'casual', label: 'Casual', description: 'Running here and there' },
    { value: 'regular', label: 'Regular', description: 'Consistent weekly runs' },
    { value: 'competitive', label: 'Competitive', description: 'Racing and pushing limits' },
]

export default function LevelScreen() {
    const router = useRouter()
    const { profile, setLevel } = useOnboardingStore()

    return (
        <View className="flex-1 bg-neutral-0 px-6 pt-16 pb-12 justify-between">
            <View className="gap-8">
                <Text variant="title-lg">What's your current level?</Text>

                <View className="gap-3">
                    {LEVELS.map((lvl) => {
                        const active = profile.level === lvl.value
                        return (
                            <Pressable
                                key={lvl.value}
                                onPress={() => setLevel(lvl.value)}
                                className={cn(
                                    'flex-row items-center justify-between px-5 py-4 rounded-xl border',
                                    active
                                        ? 'bg-primary-50 border-primary-500'
                                        : 'bg-neutral-0 border-neutral-200',
                                )}
                            >
                                <View>
                                    <Text
                                        variant="label"
                                        className={active ? 'text-primary-600' : 'text-neutral-800'}
                                    >
                                        {lvl.label}
                                    </Text>
                                    <Text variant="body-sm" className="text-neutral-400 mt-0.5">
                                        {lvl.description}
                                    </Text>
                                </View>
                                {active && (
                                    <View className="w-5 h-5 rounded-full bg-primary-500 items-center justify-center">
                                        <Text variant="body-sm" className="text-neutral-0 text-xs">
                                            ✓
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            <Button
                title="Finish"
                onPress={() => router.push('/(setup)/welcome')}
                disabled={!profile.level}
            />
        </View>
    )
}