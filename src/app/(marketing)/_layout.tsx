import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function MarketingLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name='splash' />
        <Stack.Screen name='onboard-1' />
        <Stack.Screen name='onboard-2' />
        <Stack.Screen name='onboard-3' />
        <Stack.Screen name='onboard-4' />
        <Stack.Screen name='login' />
        <Stack.Screen name='signup' />
      </Stack>
    </View>
  );
}
