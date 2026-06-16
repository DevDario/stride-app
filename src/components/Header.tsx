import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightElement,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={{ paddingRight: spacing.sm }}
          >
            <Text variant='label' style={{ color: colors.text }}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        <Text
          variant='title-sm'
          style={{ color: colors.text, textAlign: 'left' }}
        >
          {title}
        </Text>
      </View>

      <View style={styles.right}>{rightElement}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  left: {
    flex: 2,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
