import { Text } from '@components/Text';
import { LineChart } from 'react-native-gifted-charts';
import { ChartNoAxesColumnIncreasing, MapPin } from 'lucide-react-native';
import { View } from 'react-native';
import { useTheme } from 'src/theme/ThemeProvider';

export default function WeeklyRunsResume() {
  const { colors } = useTheme();
  const lineData = [
    { value: 0 },
    { value: 10 },
    { value: 8 },
    { value: 58 },
    { value: 56 },
    { value: 78 },
    { value: 74 },
    { value: 98 },
  ];

  return (
    <View className='w-fit rounded-xl bg-zinc-50 h-96 p-4'>
      <View className='flex flex-col items-self gap-2'>
        <Text variant='body-lg' className='font-semibold'>
          Running last week
        </Text>
        <View className='w-full flex flex-row gap-2 items-center justify-start'>
          <View className='w-10 h-10 bg-primary-500 rounded-sm flex items-center justify-center'>
            <MapPin color={colors.background} size={22} />
          </View>
          <Text className='font-sans-semi text-xl'>34,90 miles</Text>
          <View className='flex flex-row items-center justify-start'>
            <ChartNoAxesColumnIncreasing color={colors.primary} size={16} />
            <Text className='text-primary-500 text-md mx-1'>3.4%</Text>
            <Text className='font-semibold text-md mx-1'>vs last week</Text>
          </View>
        </View>
        {/*chart*/}
        <View className='w-full h-fit'>
          <LineChart
            areaChart
            isAnimated
            hideRules
            hideYAxisText
            hideAxesAndRules
            curved
            data={lineData}
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
        {/*details*/}
        <View className='w-full h-px bg-neutral-100 my-2' />

        <View className='flex flex-row items-center justify-center'>
          <View className='flex flex-row items-center justify-center gap-5'>
            <View className='flex flex-col justify-start items-center'>
              <View className='flex flex-row items-baseline justify-center'>
                <Text className='font-bold text-2xl'>248</Text>
                <Text variant='label'>Kcal</Text>
              </View>
              <Text variant='body-sm'>calories</Text>
            </View>
            <View className='w-px h-full bg-red-500 align-center' />
            <View className='flex flex-col justify-start items-center'>
              <View className='flex flex-row items-baseline justify-center'>
                <Text className='font-bold text-2xl'>248</Text>
                <Text variant='label'>Kcal</Text>
              </View>
              <Text variant='body-sm'>calories</Text>
            </View>
            <View className='w-px h-full bg-red-500 align-center' />
            <View className='flex flex-col justify-start items-center'>
              <View className='flex flex-row items-baseline justify-center'>
                <Text className='font-bold text-2xl'>248</Text>
                <Text variant='label'>Kcal</Text>
              </View>
              <Text variant='body-sm'>calories</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
