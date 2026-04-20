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

export const HomeScreen = () => {
  const { greeting, user } = useHomeViewModel();
  const { spacing } = useTheme();

  return (
    <Screen safeArea>
      {/*header*/}
      <View style={[styles.content, { padding: spacing.lg }]}>
        <Text variant='body' style={{ marginBottom: spacing.md }}>
          {greeting}
        </Text>
        <View className='flex flex-row items-center gap-1'>
          <Bell className='size-8' />
          <Contrast className='size-8 invert' />
        </View>
      </View>

      {/*chart*/}
      {/*chart end*/}

      {/*calendar widget*/}
      {/*calendar widget end*/}

      {/*nearby challenges*/}
      {/*nearby challenges end*/}

      {/*recent runns*/}
      {/*recent runns end*/}
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
