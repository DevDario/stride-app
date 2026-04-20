import '../../global.css';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inMarketing = segments[0] === '(marketing)';
    const inSetup = segments[0] === '(setup)';
    const inApp = segments[0] === '(app)';

    if (!isSignedIn && (inSetup || inApp)) {
      router.replace('/(marketing)/splash');
      return;
    }

    if (isSignedIn && inMarketing) {
      router.replace('/(setup)/know-you');
    }
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size='large' color='#2D9B7F' />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = Font.useFonts({
    DaysOne_400Regular: require('../assets/fonts/DaysOne-Regular.ttf'),
    InstrumentSans_400Regular: require('../assets/fonts/InstrumentSans-Regular.ttf'),
    InstrumentSans_500Medium: require('../assets/fonts/InstrumentSans-Medium.ttf'),
    InstrumentSans_600SemiBold: require('../assets/fonts/InstrumentSans-SemiBold.ttf'),
    InstrumentSans_700Bold: require('../assets/fonts/InstrumentSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
          >
            <ThemeProvider>
              <AuthGuard />
            </ThemeProvider>
          </ClerkProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
