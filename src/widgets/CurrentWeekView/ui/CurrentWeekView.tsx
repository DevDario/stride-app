import { Text } from '@components/Text';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function CurrentWeekView() {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const today = new Date();
    const sunday = getStartOfWeek(today);
    sunday.setDate(sunday.getDate() + weekOffset * 7);
    return sunday;
  }, [weekOffset]);

  const monthYear = useMemo(() => formatMonthYear(weekStart), [weekStart]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  }, []);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return {
        dayLabel: DAY_LABELS[i],
        dayNumber: date.getDate(),
        isToday: dateStr === todayStr,
      };
    });
  }, [weekStart, todayStr]);

  const goBack = useCallback(() => setWeekOffset((prev) => prev - 1), []);
  const goForward = useCallback(() => setWeekOffset((prev) => prev + 1), []);

  return (
    <View className='rounded-xl bg-zinc-50 p-4'>
      <View className='flex-row items-center justify-between mb-4'>
        <Text variant='body-lg' className='font-bold'>
          {monthYear}
        </Text>
        <View className='flex-row items-center gap-3'>
          <Pressable onPress={goBack} hitSlop={8}>
            <ChevronLeft size={20} color='#6B7280' />
          </Pressable>
          <Pressable onPress={goForward} hitSlop={8}>
            <ChevronRight size={20} color='#6B7280' />
          </Pressable>
        </View>
      </View>
      <View className='flex-row justify-between'>
        {days.map((day) => (
          <View
            key={`${day.dayLabel}-${day.dayNumber}`}
            className='flex-col items-center gap-1'
          >
            <Text variant='body-sm' className='text-neutral-500 text-xs'>
              {day.dayLabel}
            </Text>
            <View
              className={`items-center justify-center w-9 h-9 ${
                day.isToday ? 'bg-primary-500 rounded-md' : ''
              }`}
            >
              <Text
                variant='body'
                className={
                  day.isToday
                    ? 'text-white font-bold'
                    : 'text-neutral-900 font-medium'
                }
              >
                {day.dayNumber}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
