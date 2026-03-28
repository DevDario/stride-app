import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export interface SpinnerProps extends ActivityIndicatorProps {
  color?: 'primary' | 'secondary' | 'danger' | 'text' | 'background';
}

export const Spinner: React.FC<SpinnerProps> = ({ color = 'primary', ...rest }) => {
  const { colors } = useTheme();
  
  const spinnerColor = colors[color] || colors.primary;
  return <ActivityIndicator color={spinnerColor} {...rest} />;
};
