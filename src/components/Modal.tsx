import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'center' | 'bottom';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  position = 'bottom',
}) => {
  const { colors, radii, spacing } = useTheme();

  const isBottom = position === 'bottom';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={isBottom ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.content,
                isBottom ? styles.bottomContent : styles.centerContent,
                {
                  backgroundColor: colors.background,
                  padding: spacing.lg,
                  borderTopLeftRadius: isBottom ? radii.lg : radii.md,
                  borderTopRightRadius: isBottom ? radii.lg : radii.md,
                  borderBottomLeftRadius: isBottom ? 0 : radii.md,
                  borderBottomRightRadius: isBottom ? 0 : radii.md,
                },
              ]}
            >
              {isBottom && (
                <View
                  style={[styles.handle, { backgroundColor: colors.border }]}
                />
              )}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
  },
  bottomContent: {
    paddingBottom: 40,
  },
  centerContent: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
});
