import { Text } from '@components/Text';
import type { NearbyChallenge } from '@widgets/NearbyChallenges/types';
import { MapPin, ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from './Button';

interface ChallengeCardProps {
  challenge: NearbyChallenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <View
      className='rounded-xl bg-zinc-50 p-4'
      style={{ width: 220, height: 250 }}
    >
      <View className='flex-col items-start justify-between flex-1'>
        <View className='w-9 h-9 bg-primary-500 rounded-md items-center justify-center'>
          <MapPin size={18} color='#FFFFFF' />
        </View>
        <View className='flex-col items-start gap-1.5'>
          <Text variant='body-lg' className='font-semibold text-neutral-900'>
            {challenge.name}
          </Text>
          <View className='flex-row items-center gap-3'>
            <Text variant='body-sm' className='text-neutral-500 font-light'>
              {challenge.creatorUsername}
            </Text>
            <Text variant='body-sm' className='text-neutral-500'>
              {challenge.location}
            </Text>
          </View>
          <View className='flex-row items-center gap-3'>
            <Text variant='title-md' className='text-neutral-900'>
              {challenge.timeToBeat}
            </Text>
            <Text variant='body-sm' className='text-neutral-500 font-light'>
              {challenge.distance}
            </Text>
          </View>
        </View>
        <Button
          title='Beat it'
          icon={ArrowRight}
          onPress={() => {}}
          variant='primary'
          className='w-full'
        />
      </View>
    </View>
  );
}
