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
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  safeArea = true,
  style,
  ...rest
}) => {
  const { colors } = useTheme();

  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...rest}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
