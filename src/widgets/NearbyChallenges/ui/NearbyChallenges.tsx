import { Button } from '@components/Button';
import { ChallengeCard } from '@components/ChallengeCard';
import { Text } from '@components/Text';
import { useRouter } from 'expo-router';
import { SearchAlert } from 'lucide-react-native';
import { FlatList, View } from 'react-native';
import { useTheme } from 'src/theme/ThemeProvider';

import { useNearbyChallenges } from '../hooks/useNearbyChallenges';

const DEFAULT_PARAMS = {
  lat: -8.838333,
  lng: 13.234444,
  radiusKm: 10,
} as const;

const CARD_HEIGHT = 250;

function ChallengesEmptyState() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View
      className='items-center justify-center'
      style={{ height: 0.7 * CARD_HEIGHT }}
    >
      <SearchAlert size={48} color={colors.textSecondary} strokeWidth={1.5} />
      <Text variant='title-sm' style={{ color: colors.textSecondary }}>
        No challenges yet
      </Text>
      <Text
        variant='body-sm'
        className='text-neutral-400 text-center mt-1 mb-4'
      >
        Look in other areas or start your own
      </Text>
      <Button
        variant='primary'
        className='mt-3'
        title='See in other areas'
        onPress={() => router.push('/(tabs)/challenges')}
      />
    </View>
  );
}

export default function NearbyChallenges() {
  const { data: challenges } = useNearbyChallenges(DEFAULT_PARAMS);

  if (!challenges?.length) {
    return (
      <View style={{ height: CARD_HEIGHT }} className='justify-center'>
        <ChallengesEmptyState />
      </View>
    );
  }

  return (
    <View style={{ height: CARD_HEIGHT }}>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChallengeCard challenge={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingLeft: 0 }}
      />
    </View>
  );
}
