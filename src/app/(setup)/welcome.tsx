import { Image, View } from 'react-native';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { useOnboardingComplete } from '@hooks/useOnboardingComplete';

export default function WelcomeScreen() {
  const { complete, profile } = useOnboardingComplete();
  const firstName = profile.name.split(' ')[0] || 'Runner';

  return (
    <View className='flex-1 bg-neutral-0 px-6 pt-16 pb-12 items-center justify-between'>
      <View className='flex-1 items-center justify-center gap-6'>
        <Image
          source={require('../../assets/illustrations/welcome.png')}
          className='w-64 h-64'
          resizeMode='contain'
        />
        <Text variant='title-lg' className='text-center'>
          Welcome, {firstName}!
        </Text>
        <Text variant='body' className='text-neutral-500 text-center'>
          Your profile is set. Share your routes, discover challenges, and test
          your limit.
        </Text>
      </View>

      <Button title='Done' onPress={complete} className='w-full' />
    </View>
  );
}
