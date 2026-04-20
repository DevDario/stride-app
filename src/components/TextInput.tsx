import { TextInput, TextInputProps, View } from 'react-native';
import { Text } from '@components/Text';
import { cn } from '@utils/cn';

interface StyledTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  className?: string;
}

export function StyledTextInput({
  label,
  error,
  helper,
  className,
  ...props
}: StyledTextInputProps) {
  return (
    <View className='gap-1'>
      {label && (
        <Text variant='label' className='text-neutral-600 mb-1'>
          {label}
        </Text>
      )}

      <TextInput
        className={cn(
          'bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3',
          'font-sans text-base text-neutral-900',
          'focus:border-primary-500',
          error && 'border-error',
          className
        )}
        placeholderTextColor='#a0a0a0'
        {...props}
      />

      {error && (
        <Text variant='body-sm' className='text-error'>
          {error}
        </Text>
      )}

      {helper && !error && (
        <Text variant='body-sm' className='text-neutral-400'>
          {helper}
        </Text>
      )}
    </View>
  );
}
