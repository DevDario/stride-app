import { Header } from '@components/Header';
import { Screen } from '@components/Screen';
import { Text } from '@components/Text';
import { CurrentWeekView } from '@widgets/CurrentWeekView';
import { NearbyChallenges } from '@widgets/NearbyChallenges';
import { RecentRuns } from '@widgets/RecentRuns';
import { WeeklyRunsResume } from '@widgets/WeeklyRunsResume';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

export const HomeScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen safeArea>
      <Header
        title='Ready to get moving?'
        rightElement={
          // should go to notifications screen
          <Pressable onPress={() => router.push('/(tabs)/home')}>
            <Bell className='size-12' fill={colors.text} />
          </Pressable>
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <WeeklyRunsResume />

        <CurrentWeekView />

        <Text
          variant='title-md'
          style={{ color: colors.text, textAlign: 'left' }}
        >
          Nearby Challenges
        </Text>
        <NearbyChallenges />

        <Text
          variant='title-md'
          style={{ color: colors.text, textAlign: 'left' }}
        >
          Your recent runs
        </Text>
        <RecentRuns />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    gap: 13,
    paddingBottom: 24,
  },
});
