import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Spinner } from './Spinner';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  title: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  title,
  style,
  disabled,
  ...rest
}) => {
  const { colors, radii, spacing } = useTheme();

  const getBackgroundColor = () => {
    if (variant === 'ghost') return 'transparent';
    if (variant === 'secondary') return colors.secondary;
    if (variant === 'danger') return colors.danger;
    return colors.primary;
  };

  const getTextColor = ():
    | 'background'
    | 'primary'
    | 'secondary'
    | 'danger' => {
    if (variant === 'ghost') return 'primary';
    return 'background';
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <Spinner color={getTextColor()} />
      ) : (
        <Text color={getTextColor()} weight="medium" style={styles.text}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
