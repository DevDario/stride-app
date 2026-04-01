import * as React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  StyleSheet,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  style,
  ...rest
}) => {
  const { colors, spacing, radii, typography } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <Text style={{ marginBottom: spacing.xs }}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radii.sm,
            color: colors.text,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.sm,
            fontSize: typography.sizes.md,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />
      {error && (
        <Text
          className='text-danger'
          variant="body"
          style={{ marginTop: spacing.xs }}
        >
          {error}
        </Text>
      )}
      {!error && helperText && (
        <Text
          className='text-danger'
          variant="body"
          style={{ marginTop: spacing.xs }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
});
