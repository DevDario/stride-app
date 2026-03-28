import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const { spacing } = useTheme();
  // Image required by scaffolding instructions
  const mascot = require('../assets/images/not-found.png');

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Image source={mascot} style={styles.image} resizeMode="contain" />
      <Text
        variant="h3"
        weight="bold"
        style={{ marginBottom: spacing.sm, ...styles.centerText }}
      >
        {title}
      </Text>
      {message && (
        <Text color="textSecondary" style={styles.centerText}>
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
  centerText: {
    textAlign: 'center',
  },
});
