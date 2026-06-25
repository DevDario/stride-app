import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const { spacing, colors } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text
        variant='title-md'
        style={{
          marginBottom: spacing.sm,
          textAlign: 'center',
          color: colors.textSecondary,
        }}
      >
        {title}
      </Text>
      {message && (
        <Text
          variant='body'
          style={{ textAlign: 'center', color: colors.textSecondary }}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
