import * as Location from 'expo-location';
import { AlertTriangle, Crosshair } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { useLocationStore } from 'src/features/map/store/locationStore';
import { useTheme } from 'src/theme/ThemeProvider';

import { Button } from '../Button';
import { Text } from '../Text';

interface PermissionGateProps {
  children: React.ReactNode;
  requireBackground?: boolean;
}

export function PermissionGate({
  children,
  requireBackground = false,
}: PermissionGateProps) {
  const { colors } = useTheme();
  const {
    foregroundGranted,
    backgroundGranted,
    setForegroundGranted,
    setBackgroundGranted,
    setPermissionState,
  } = useLocationStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    setChecking(true);
    const foreground = await Location.requestForegroundPermissionsAsync();
    setForegroundGranted(foreground.granted);
    setPermissionState(foreground.granted ? 'granted' : 'denied');

    if (foreground.granted && requireBackground) {
      const background = await Location.requestBackgroundPermissionsAsync();
      setBackgroundGranted(background.granted);
    }
    setChecking(false);
  }

  if (checking) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Crosshair size={32} color={colors.textSecondary} />
      </View>
    );
  }

  if (!foregroundGranted) {
    return (
      <View className='flex-1 items-center justify-center px-8'>
        <AlertTriangle size={48} color={colors.danger} strokeWidth={1.5} />
        <Text
          variant='title-sm'
          style={{ color: colors.text }}
          className='mt-4 text-center'
        >
          Location access needed
        </Text>
        <Text variant='body-sm' className='text-neutral-400 text-center mt-2'>
          Stride needs your location to show your position on the map and track
          your runs.
        </Text>
        <Button
          variant='primary'
          className='mt-6'
          title='Open Settings'
          onPress={() => Linking.openSettings()}
        />
        <Button
          variant='ghost'
          className='mt-3'
          title='Try again'
          onPress={checkPermissions}
        />
      </View>
    );
  }

  if (requireBackground && !backgroundGranted) {
    return (
      <View className='flex-1 items-center justify-center px-8'>
        <AlertTriangle
          size={48}
          color={colors.textSecondary}
          strokeWidth={1.5}
        />
        <Text
          variant='title-sm'
          style={{ color: colors.text }}
          className='mt-4 text-center'
        >
          Background tracking off
        </Text>
        <Text variant='body-sm' className='text-neutral-400 text-center mt-2'>
          Enable background location to track runs even when the app is
          minimized.
        </Text>
        <Button
          variant='primary'
          className='mt-6'
          title='Open Settings'
          onPress={() => Linking.openSettings()}
        />
        <Button
          variant='ghost'
          className='mt-3'
          title='Continue without'
          onPress={() => setBackgroundGranted(false)}
        />
      </View>
    );
  }

  return <>{children}</>;
}
