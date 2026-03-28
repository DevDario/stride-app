import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', visible, onHide, duration = 3000 }) => {
  const { colors, spacing, radii } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 50,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hide();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      hide();
    }
  }, [visible, duration, translateY]);

  const hide = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onHide();
    });
  };

  const getBackgroundColor = () => {
    if (type === 'success') return colors.secondary;
    if (type === 'error') return colors.danger;
    return colors.primary;
  };

  // Skip rendering if off screen entirely (simplification for animated component)
  // This causes a TS error in some strict contexts if we returned null conditionally,
  // but Animated.View can just be rendered off screen.

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          backgroundColor: getBackgroundColor(),
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
        },
      ]}
    >
      <Text color="background" weight="medium">
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
