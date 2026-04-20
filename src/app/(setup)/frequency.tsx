import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { useOnboardingStore } from '@store/onboardingStore'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import {runOnJS} from "react-native-worklets"
import { tokens } from 'src/theme/tokens'

const MIN = 1
const MAX = 14
const SWIPE_THRESHOLD = 40

export default function FrequencyScreen() {
    const router = useRouter()
    const { profile, setWeeklyFrequency } = useOnboardingStore()
    const freq = profile.weeklyFrequency

    const startValue = useSharedValue(freq)
    const scale = useSharedValue(1)

    const gesture = Gesture.Pan()
        .onBegin(() => {
            startValue.value = freq
            scale.value = withSpring(1.2)
        })
        .onUpdate((event) => {
            const diff = Math.floor(-event.translationY / SWIPE_THRESHOLD)
            const newValue = Math.min(MAX, Math.max(MIN, startValue.value + diff))
            
            if (newValue !== freq) {
                runOnJS(setWeeklyFrequency)(newValue)
            }
        })
        .onFinalize(() => {
            scale.value = withSpring(1)
        })

    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))

    return (
        <View className="flex-1 bg-neutral-0 px-6 pt-16 pb-12 justify-between">
            <GestureDetector gesture={gesture}>
                <View className="flex-1 gap-10 items-center justify-center">
                    <Text variant="title-lg" className="absolute top-0 left-0">
                        How often do you run?
                    </Text>

                    <View className="items-center gap-2">
                        <Animated.Text
                            style={[{ fontSize: 102, fontWeight: '700', color: tokens.colors.light.text }, animatedTextStyle]}
                        >
                            {freq}
                        </Animated.Text> 
                        <Text variant="body-sm" className="text-neutral-400">
                            swipe up/down to change
                        </Text>
                    </View>
                </View>
            </GestureDetector>

            <Button
                title="Next"
                onPress={() => router.push('/(setup)/schedule')}
            />
        </View>
    )
}