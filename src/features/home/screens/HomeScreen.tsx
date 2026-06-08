import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useHomeViewModel } from '../hooks/useHomeViewModel';
import { Screen } from '@components/Screen';
import { Header } from '@components/Header';
import { Text } from '@components/Text';
import { Card } from '@components/Card';
import { Avatar } from '@components/Avatar';
import { useTheme } from '../../../theme/ThemeProvider';

import { Bell, Contrast } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { WeeklyRunsResume } from '@widgets/WeeklyRunsResume';

export const HomeScreen = () => {
  const { greeting } = useHomeViewModel();
  const { spacing, colors } = useTheme();
  const router = useRouter();

  return (
    <Screen safeArea>
      {/*header*/}
      <Header
        title={'Ready to get moving?'}
        rightElement={
          // should go to notifications screen
          <Pressable onPress={() => router.push('/(tabs)/home')}>
            <Bell className='size-12' fill={colors.text} />
          </Pressable>
        }
      />
      <View style={styles.container}>
        {/*chart*/}
        <WeeklyRunsResume />
        {/*chart end*/}

        {/*calendar widget*/}
        {/*calendar widget end*/}

        {/*nearby challenges*/}
        {/*nearby challenges end*/}

        {/*recent runns*/}
        {/*recent runns end*/}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
