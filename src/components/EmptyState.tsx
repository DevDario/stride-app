import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const { spacing, colors } = useTheme();
  const mascot = require('../assets/images/not-found.png');

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Image source={mascot} style={styles.image} resizeMode='contain' />
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
