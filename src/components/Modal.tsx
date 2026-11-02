import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeProvider';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: (number | string)[];
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  snapPoints,
}) => {
  const { colors, radii } = useTheme();
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.4}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior='close'
      />
    ),
    []
  );

  return (
    <BottomSheet
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: radii.lg,
        borderTopRightRadius: radii.lg,
      }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView
        style={{
          paddingTop: 8,
          paddingHorizontal: 24,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};
