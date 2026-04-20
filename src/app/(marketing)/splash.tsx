import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@components/Text';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(marketing)/onboard-1');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className='flex-1 items-center justify-center bg-primary-500'>
      <Text variant='title-xl' className='text-neutral-0'>
        Stride
      </Text>
      <Text variant='body-sm' className='text-primary-100 mt-2'>
        Test your limit
      </Text>
    </View>
  );
}
