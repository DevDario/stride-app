import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useHomeViewModel } from '../hooks/useHomeViewModel';
import { Screen } from '@components/Screen';
import { Header } from '@components/Header';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { Avatar } from '@components/Avatar';
import { useTheme } from '../../../theme/ThemeProvider';

export const HomeScreen = () => {
  const { greeting, user, isLoading, fetchUser } = useHomeViewModel();
  const { spacing } = useTheme();

  return (
    <Screen safeArea>
      <Header title="Home" />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <Text variant="h2" weight="bold" style={{ marginBottom: spacing.md }}>
          {greeting}
        </Text>

        <Card style={{ marginBottom: spacing.lg }}>
          <View style={styles.userRow}>
            <Avatar initials={user?.name || '?'} />
            <View style={{ marginLeft: spacing.md }}>
              <Text weight="medium">{user?.name || 'Guest'}</Text>
              <Text color="textSecondary" variant="caption">
                {user?.role || 'No Role'}
              </Text>
            </View>
          </View>
        </Card>

        <Button title="Reload User" loading={isLoading} onPress={fetchUser} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
