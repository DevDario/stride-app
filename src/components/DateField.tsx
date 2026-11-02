import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface DateFieldProps {
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const FALLBACK_DATE = new Date(2000, 0, 1);

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateField({
  label,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  error,
  minimumDate,
  maximumDate,
}: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, isDark } = useTheme();
  const selected = parseDate(value) ?? FALLBACK_DATE;

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') setIsOpen(false);
    if (event.type === 'dismissed' || !date) return;
    onChange(formatDate(date));
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
          className={value ? 'text-neutral-900' : 'text-neutral-400'}
        >
          {value ?? placeholder}
        </Text>
      </Pressable>

      {error && (
        <Text variant='body-sm' className='text-error'>
          {error}
        </Text>
      )}

      {Platform.OS === 'ios' ? (
        <Modal visible={isOpen} onClose={() => setIsOpen(false)}>
          <View className='gap-4'>
            <DateTimePicker
              value={selected}
              mode='date'
              display='spinner'
              onChange={handleChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant={isDark ? 'dark' : 'light'}
              textColor={colors.text}
              style={{ height: 200 }}
            />
            <Button title='Done' onPress={() => setIsOpen(false)} />
          </View>
        </Modal>
      ) : (
        isOpen && (
          <DateTimePicker
            value={selected}
            mode='date'
            display='default'
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
  );
}
