import { useUser } from '@clerk/expo';
import { BackButton } from '@components/BackButton';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Bell, Crosshair, MapPinned, ShieldCheck } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Linking, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

type Phase = 'location' | 'background' | 'notifications' | 'done';

export default function PermissionsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('location');
  const [locationGranted, setLocationGranted] = useState(false);
  const [backgroundGranted, setBackgroundGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [settingsBanner, setSettingsBanner] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    const loc = await Location.getForegroundPermissionsAsync();
    if (!loc.granted) {
      setPhase('location');
      return;
    }
    setLocationGranted(true);

    const bg = await Location.getBackgroundPermissionsAsync().catch(() => null);
    if (bg?.granted) {
      setBackgroundGranted(true);
      const notif = await Notifications.getPermissionsAsync();
      if (notif.granted) {
        setNotificationsGranted(true);
        setPhase('done');
        return;
      }
      setPhase('notifications');
      return;
    }
    setPhase('background');
  }

  const requestLocation = useCallback(async () => {
    setSettingsBanner(false);
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) {
      setLocationGranted(true);
      setPhase('background');
    } else {
      setSettingsBanner(true);
    }
  }, []);

  const requestBackground = useCallback(async () => {
    setSettingsBanner(false);
    try {
      const { granted } = await Location.requestBackgroundPermissionsAsync();
      if (granted) {
        setBackgroundGranted(true);
        setPhase('notifications');
      } else {
        setSettingsBanner(true);
      }
    } catch {
      setSettingsBanner(true);
    }
  }, []);

  const requestNotifications = useCallback(async () => {
    setSettingsBanner(false);
    const { granted } = await Notifications.requestPermissionsAsync();
    if (granted) {
      setNotificationsGranted(true);
      setPhase('done');
    } else {
      setSettingsBanner(true);
    }
  }, []);

  const skip = useCallback(() => {
    setSettingsBanner(false);
    if (phase === 'location') {
      setPhase('background');
    } else if (phase === 'background') {
      setPhase('notifications');
    } else {
      setPhase('done');
    }
  }, [phase]);

  function handleBack() {
    if (phase === 'background') setPhase('location');
    else if (phase === 'notifications') setPhase('background');
    else if (phase === 'done') setPhase('notifications');
    else router.back();
  }

  return (
    <View className='flex-1 bg-neutral-0 px-6 pb-12 justify-between'>
      <BackButton onPress={handleBack} />
      <View className='flex-1 items-center justify-center gap-6'>
        {phase === 'location' && (
          <>
            <View className='w-20 h-20 rounded-full bg-primary-50 items-center justify-center'>
              <Crosshair size={40} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text variant='title-lg' className='text-center px-4'>
              Let us find you
            </Text>
            <Text
              variant='body'
              className='text-neutral-500 text-center px-8 leading-6'
            >
              Stride uses your location to show your position on the map and
              track your runs in real time.
            </Text>
            {settingsBanner && (
              <View className='bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mx-4'>
                <Text variant='body-sm' className='text-amber-800 text-center'>
                  Location permission was declined. You can enable it later in
                  Settings.
                </Text>
              </View>
            )}
          </>
        )}

        {phase === 'background' && (
          <>
            <View className='w-20 h-20 rounded-full bg-primary-50 items-center justify-center'>
              <MapPinned size={40} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text variant='title-lg' className='text-center px-4'>
              Keep tracking going
            </Text>
            <Text
              variant='body'
              className='text-neutral-500 text-center px-8 leading-6'
            >
              Background location lets Stride record your route while your phone
              is locked. Runs still work without it, but only while the app is
              open.
            </Text>
            {settingsBanner && (
              <View className='bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mx-4'>
                <Text variant='body-sm' className='text-amber-800 text-center'>
                  Background location was declined. You can enable it later in
                  Settings.
                </Text>
              </View>
            )}
          </>
        )}

        {phase === 'notifications' && (
          <>
            <View className='w-20 h-20 rounded-full bg-primary-50 items-center justify-center'>
              <Bell size={40} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text variant='title-lg' className='text-center px-4'>
              Stay in the loop
            </Text>
            <Text
              variant='body'
              className='text-neutral-500 text-center px-8 leading-6'
            >
              Notifications let us keep your run tracking active even when the
              app is in the background.
            </Text>
            {settingsBanner && (
              <View className='bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mx-4'>
                <Text variant='body-sm' className='text-amber-800 text-center'>
                  Notification permission was declined. You can enable it later
                  in Settings.
                </Text>
              </View>
            )}
          </>
        )}

        {phase === 'done' && (
          <>
            <View className='w-20 h-20 rounded-full bg-primary-50 items-center justify-center'>
              <ShieldCheck size={40} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text variant='title-lg' className='text-center px-4'>
              All set
            </Text>
            <Text
              variant='body'
              className='text-neutral-500 text-center px-8 leading-6'
            >
              {locationGranted && backgroundGranted && notificationsGranted
                ? 'All permissions are enabled. Time to hit the pavement!'
                : 'You can change these anytime in your device settings.'}
            </Text>
          </>
        )}
      </View>

      <View className='gap-3 px-6'>
        {phase === 'location' && (
          <>
            <Button
              title='Allow Location'
              variant='primary'
              onPress={requestLocation}
            />
            <Button
              title='Skip'
              variant='ghost'
              onPress={skip}
              className='bg-transparent border border-neutral-200'
            />
          </>
        )}

        {phase === 'background' && (
          <>
            <Button
              title='Allow Background Tracking'
              onPress={requestBackground}
              variant='primary'
            />
            <Button
              title='Not now'
              onPress={skip}
              variant='ghost'
              className='bg-transparent border border-neutral-200'
            />
          </>
        )}

        {phase === 'notifications' && (
          <>
            <Button
              title='Allow Notifications'
              variant='primary'
              onPress={requestNotifications}
            />
            <Button
              title='Skip'
              variant='ghost'
              onPress={skip}
              className='bg-transparent border border-neutral-200'
            />
          </>
        )}

        {phase === 'done' && (
          <>
            <Button
              title='Continue'
              variant='primary'
              onPress={async () => {
                try {
                  await user?.update({
                    unsafeMetadata: {
                      ...user.unsafeMetadata,
                      permissionsHandled: true,
                    },
                  });
                } catch {
                  /* non-critical */
                }
                router.push('/(setup)/welcome');
              }}
            />
            {settingsBanner && (
              <Button
                variant='secondary'
                title='Open Settings'
                onPress={() => Linking.openSettings()}
                className='bg-transparent border border-neutral-200'
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}
