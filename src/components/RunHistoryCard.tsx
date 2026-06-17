import { Text } from '@components/Text';
import type { RunHistoryRecord } from '@widgets/RecentRuns/types';
import { Clock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface RunHistoryCardProps {
  run: RunHistoryRecord;
  onPress?: () => void;
}

export function RunHistoryCard({ run, onPress }: RunHistoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className='rounded-xl bg-zinc-50 p-4 flex-row items-center justify-between w-full'
    >
      <View className='flex-row items-center gap-2 flex-1'>
        <View className='w-9 h-9 bg-primary-500 rounded-md items-center justify-center'>
          <Clock size={18} color='#FFFFFF' />
        </View>
        <View className='flex-col items-start'>
          <Text variant='title-xs' className='font-medium text-neutral-900'>
            {run.duration}
          </Text>
          <Text variant='body-sm' className='font-light text-neutral-500'>
            {run.dayLabel} {run.startTime}
          </Text>
        </View>
      </View>
      <View className='flex-col items-end gap-0.5'>
        <Text variant='title-xs' className='font-medium text-neutral-900'>
          {run.distance}
        </Text>
        <Text variant='body-sm' className='font-light text-neutral-500'>
          {run.finishTime}
        </Text>
      </View>
    </Pressable>
  );
}
