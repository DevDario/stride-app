import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { cn } from '@utils/cn';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export interface OptionFieldOption<T extends string> {
  value: T;
  label: string;
}

interface OptionFieldProps<T extends string> {
  label?: string;
  value: T | null;
  options: OptionFieldOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
}

export function OptionField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select',
  error,
}: OptionFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  function handleSelect(next: T) {
    onChange(next);
    setIsOpen(false);
  }

  return (
    <View className='gap-1'>
      {label && (
        <Text variant='label' className='text-neutral-600 mb-1'>
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => setIsOpen(true)}
        className={cn(
          'bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3',
          error && 'border-error'
        )}
      >
        <Text
          variant='body'
          className={selected ? 'text-neutral-900' : 'text-neutral-400'}
        >
          {selected?.label ?? placeholder}
        </Text>
      </Pressable>

      {error && (
        <Text variant='body-sm' className='text-error'>
          {error}
        </Text>
      )}

      <Modal visible={isOpen} onClose={() => setIsOpen(false)}>
        <View className='gap-1'>
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
                className='flex-row items-center justify-between py-3.5'
              >
                <Text
                  variant='body'
                  className={
                    isSelected
                      ? 'text-primary-600 font-sans-semi'
                      : 'text-neutral-900'
                  }
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Check size={18} strokeWidth={2} color='#237d66' />
                )}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
