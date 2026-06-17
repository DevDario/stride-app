import { RunHistoryCard } from '@components/RunHistoryCard';
import { Text } from '@components/Text';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { useRecentRuns } from '../hooks/useRecentRuns';

export default function RecentRuns() {
  const { data: runs } = useRecentRuns();
  const router = useRouter();

  return (
    <View className='gap-3'>
      {runs?.map((run) => (
        <RunHistoryCard key={run.id} run={run} />
      ))}
      <View className='items-center pt-6 w-full'>
        <Text
          onPress={() => router.push('/(tabs)/home')}
          variant='label'
          className='font-light text-neutral-500 px-4 text-lg'
        >
          See all
        </Text>
      </View>
    </View>
  );
}
