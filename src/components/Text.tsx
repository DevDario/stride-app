import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?:
    | 'primary'
    | 'secondary'
    | 'text'
    | 'textSecondary'
    | 'danger'
    | 'background';
  weight?: 'regular' | 'medium' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  style,
  ...rest
}) => {
  const { colors, typography } = useTheme();

  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return typography.sizes.xxl;
      case 'h2':
        return typography.sizes.xl;
      case 'h3':
        return typography.sizes.lg;
      case 'caption':
        return typography.sizes.sm;
      default:
        return typography.sizes.md;
    }
  };

  const getWeight = () => typography.weights[weight] as any;

  return (
    <RNText
      style={[
        {
          fontSize: getFontSize(),
          fontWeight: getWeight(),
          color: colors[color as keyof typeof colors] || colors.text,
        },
        style,
      ]}
      {...rest}
    />
  );
};
