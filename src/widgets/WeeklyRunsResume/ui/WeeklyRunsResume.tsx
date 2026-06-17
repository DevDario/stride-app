import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { useRouter } from 'expo-router';
import {
  ChartNoAxesColumnIncreasing,
  Footprints,
  Milestone,
} from 'lucide-react-native';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from 'src/theme/ThemeProvider';

import { useWeeklyRunsResume } from '../hooks/useWeeklyRunsResumeWidget';

export default function WeeklyRunsResume() {
  const { colors } = useTheme();
  const { data: summary } = useWeeklyRunsResume();
  const router = useRouter();

  if (!summary) {
    return (
      <View className='w-fit rounded-xl bg-zinc-50 h-64 p-4 items-center justify-center'>
        <Footprints size={48} color={colors.textSecondary} strokeWidth={1.5} />
        <Text
          variant='title-sm'
          style={{ color: colors.textSecondary }}
          className='mt-3'
        >
          No runs this week yet
        </Text>
        <Text variant='body-sm' className='text-neutral-400 text-center mt-1'>
          Start your first run to see your weekly summary
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
    <View className='w-fit rounded-xl bg-zinc-50 h-96 p-4'>
      <View className='flex flex-col items-self gap-2'>
        <View className='flex-row items-center justify-between'>
          <Text variant='body-lg' className='font-semibold'>
            Running last week
          </Text>
        </View>
        <View className='w-full flex flex-row gap-2 items-center justify-start'>
          <View className='w-10 h-10 bg-primary-500 rounded-sm flex items-center justify-center'>
            <Milestone color={colors.background} size={23} />
          </View>
          <Text className='font-sans-semi text-xl'>
            {summary.totalDistance} miles
          </Text>
          <View className='flex flex-row items-center justify-start'>
            <ChartNoAxesColumnIncreasing color={colors.primary} size={16} />
            <Text className='text-primary-500 text-md mx-1'>
              {summary.percentageChange}%
            </Text>
            <Text className='font-semibold text-md mx-1'>vs last week</Text>
          </View>
        </View>
        <View className='w-full h-fit'>
          <LineChart
            areaChart
            isAnimated
            hideRules
            hideYAxisText
            hideAxesAndRules
            curved
            data={summary.chartData}
            height={100}
            spacing={54}
            initialSpacing={30}
            color1={colors.primary}
            textColor1={colors.text}
            hideDataPoints
            dataPointsColor1={colors.primary}
            startFillColor1={colors.primary}
            startOpacity={0.8}
            endOpacity={0.3}
          />
        </View>
        <View className='w-full h-px bg-neutral-100 my-2' />
        <View className='flex flex-row items-center justify-center'>
          <View className='flex flex-row items-center justify-center gap-5'>
            <View className='flex flex-col justify-start items-center'>
              <View className='flex flex-row items-baseline justify-center'>
                <Text className='font-bold text-2xl'>{summary.calories}</Text>
                <Text variant='label'>Kcal</Text>
              </View>
              <Text variant='body-sm'>Calories</Text>
            </View>
            <View className='w-px h-full bg-neutral-200' />
            <View className='flex flex-col justify-start items-center'>
              <View className='flex flex-row items-baseline justify-center'>
                <Text className='font-bold text-2xl'>
                  {summary.elevationGain}
                </Text>
                <Text variant='label'>m</Text>
              </View>
              <Text variant='body-sm'>Elevation Gain</Text>
            </View>
            <View className='w-px h-full bg-neutral-200' />
            <View className='flex flex-col justify-start items-center'>
              <View className='flex flex-row items-baseline justify-center'>
                <Text className='font-bold text-2xl'>{summary.avgPace}</Text>
              </View>
              <Text variant='body-sm'>Avg. Pace</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
