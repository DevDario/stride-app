import { Header } from '@components/Header';
import { Screen } from '@components/Screen';
import { WeeklyRunsResume } from '@widgets/WeeklyRunsResume';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

export const HomeScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen safeArea>
      {/*header*/}
      <Header
        title='Ready to get moving?'
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
