import { useRouter } from 'expo-router'
import { Image, ImageSourcePropType, View,StyleSheet } from 'react-native'
import { Text } from '@components/Text'
import { Button } from '@components/Button'

interface OnboardSlideProps {
    headline: string
    description: string
    illustration: ImageSourcePropType
    nextRoute: string
    buttonLabel?: string
}

export function OnboardSlide({
    headline,
    description,
    illustration,
    nextRoute,
    buttonLabel = 'Next',
}: OnboardSlideProps) {
    const router = useRouter()

    return (
        <View style={styles.container} className="flex-1 justify-center items-center">

            <View className="flex-1 justify-center w-full h-full items-center">
                <Image source={illustration} style={styles.image} />
            </View>

            <View className="px-6 pt-8 pb-12 gap-4">
                <Text variant="title-lg">{headline}</Text>
                <Text variant="body" className="text-neutral-500">
                    {description}
                </Text>

                <Button
                    title={buttonLabel}
                    onPress={() => router.push(nextRoute as never)}
                    className="mt-4"
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 450,
        height: 450,
        resizeMode: 'contain',
    },
});