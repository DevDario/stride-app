import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeProvider';

export interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      hitSlop={12}
      accessibilityRole='button'
      accessibilityLabel='Go back'
      style={{
        alignSelf: 'flex-start',
        marginTop: insets.top + spacing.xs,
      }}
    >
      <ArrowLeft size={22} strokeWidth={1.5} color={colors.text} />
    </Pressable>
  );
}
