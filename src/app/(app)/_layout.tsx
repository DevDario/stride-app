import { useAuth, useUser } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { colors } = useTheme();

  if (!isSignedIn) return <Redirect href='/(marketing)/splash' />;

  if (!user?.publicMetadata?.onboardingComplete) {
    return <Redirect href='/(setup)/know-you' />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
      </Stack>
    </View>
  );
}
