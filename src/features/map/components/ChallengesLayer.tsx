import { Marker } from '@maplibre/maplibre-react-native';
import { FlagTriangleRight } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useTheme } from 'src/theme/ThemeProvider';

import type { ChallengeMarker } from '../types/map.types';

interface ChallengesLayerProps {
  challenges: ChallengeMarker[];
}

export function ChallengesLayer({ challenges }: ChallengesLayerProps) {
  const { colors } = useTheme();

  return (
    <>
      {challenges.map((ch) => (
        <Marker key={ch.id} id={ch.id} lngLat={ch.coordinate}>
          <View style={{ alignItems: 'center' }}>
            <FlagTriangleRight size={20} color={colors.danger} />
            <Text
              style={{
                fontSize: 10,
                color: colors.text,
                backgroundColor: colors.background,
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 4,
                overflow: 'hidden',
                marginTop: 2,
              }}
            >
              {ch.name}
            </Text>
          </View>
        </Marker>
      ))}
    </>
  );
}
