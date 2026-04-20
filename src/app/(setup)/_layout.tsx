import { useAuth, useUser } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function SetupLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { colors } = useTheme();

  if (!isSignedIn) return <Redirect href='/(marketing)/splash' />;

  if (user?.publicMetadata?.onboardingComplete) {
    return <Redirect href='/(tabs)/home' />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name='know-you' />
        <Stack.Screen name='frequency' />
        <Stack.Screen name='schedule' />
        <Stack.Screen name='level' />
        <Stack.Screen name='welcome' />
      </Stack>
    </View>
  );
}
