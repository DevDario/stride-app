import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface BadgeProps {
  label: string;
  color?: 'primary' | 'secondary' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'primary' }) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors[color],
          borderRadius: radii.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs / 2,
        },
      ]}
    >
      <Text variant="caption" weight="medium" color="background">
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
