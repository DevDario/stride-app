import { useAuth, useUser } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { colors } = useTheme();

  if (!isSignedIn) return <Redirect href='/(marketing)/splash' />;

  if (!user?.unsafeMetadata?.onboardingComplete) {
    return <Redirect href='/(setup)/know-you' />;
  }

  if (!user?.unsafeMetadata?.permissionsHandled) {
    return <Redirect href='/(app)/permissions' />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='permissions' />
      </Stack>
    </View>
  );
}
