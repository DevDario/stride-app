import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeProvider';

export interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  keyboardVerticalOffset?: number;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  safeArea = true,
  keyboardVerticalOffset = 0,
  style,
  className,
  ...rest
}) => {
  const { colors } = useTheme();

  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: colors.background }]}
      {...rest}
    >
      <KeyboardAvoidingView
        className={className}
        style={[styles.keyboardAvoidingView, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {children}
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
