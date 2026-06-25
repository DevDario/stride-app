import { Button } from '@components/Button';
import { RunHistoryCard } from '@components/RunHistoryCard';
import { Text } from '@components/Text';
import { useRouter } from 'expo-router';
import { ClipboardList } from 'lucide-react-native';
import { View } from 'react-native';
import { useTheme } from 'src/theme/ThemeProvider';

import { useRecentRuns } from '../hooks/useRecentRuns';

export default function RecentRuns() {
  const { data: runs } = useRecentRuns();
  const router = useRouter();
  const { colors } = useTheme();

  if (!runs?.length) {
    return (
      <View className='items-center justify-center py-10'>
        <ClipboardList
          size={48}
          color={colors.textSecondary}
          strokeWidth={1.5}
        />
        <Text
          variant='title-sm'
          style={{ color: colors.textSecondary }}
          className='mt-3'
        >
          No runs recorded yet
        </Text>
        <Text variant='body-sm' className='text-neutral-400 text-center mt-1'>
          Your running history will appear here
        </Text>
        <Button
          variant='primary'
          className='mt-3'
          title='Start running'
          onPress={() => router.push('/(tabs)/map')}
        />
      </View>
    );
  }

  return (
    <View className='gap-3'>
      {runs.map((run) => (
        <RunHistoryCard key={run.id} run={run} />
      ))}
      <View className='items-center pt-6 w-full'>
        <Text
          onPress={() => router.push('/(tabs)/history')}
          variant='label'
          className='font-light text-neutral-500 px-4 text-lg'
        >
          See all
        </Text>
      </View>
    </View>
  );
}
