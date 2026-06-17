import { AreaOverlay } from '@components/map/AreaOverlay';
import { StrideMapView } from '@components/map/MapView';
import { PermissionGate } from '@components/map/PermissionGate';
import { UserLocationDot } from '@components/map/UserLocationDot';
import { useRouter } from 'expo-router';
import { ChevronLeft, Navigation } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTheme } from 'src/theme/ThemeProvider';

const LUANDA_DISTRICTS: {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  polygon: [number, number][];
}[] = [
  {
    id: 'samba',
    rating: 4,
    polygon: [
      [13.22, -8.84],
      [13.25, -8.84],
      [13.25, -8.82],
      [13.22, -8.82],
    ],
  },
  {
    id: 'marginal',
    rating: 5,
    polygon: [
      [13.18, -8.86],
      [13.21, -8.86],
      [13.21, -8.84],
      [13.18, -8.84],
    ],
  },
  {
    id: 'ilha',
    rating: 3,
    polygon: [
      [13.23, -8.78],
      [13.26, -8.78],
      [13.26, -8.76],
      [13.23, -8.76],
    ],
  },
];

export function MapScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PermissionGate>
        <StrideMapView>
          <UserLocationDot />

          {LUANDA_DISTRICTS.map((district) => (
            <AreaOverlay
              key={district.id}
              id={district.id}
              rating={district.rating}
              geoJson={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [district.polygon],
                },
              }}
            />
          ))}
        </StrideMapView>
      </PermissionGate>

      <Pressable
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 54,
          left: 16,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <ChevronLeft size={24} color={colors.text} />
      </Pressable>

      <Pressable
        onPress={() => {}}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 16,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Navigation size={24} color='#FFFFFF' />
      </Pressable>
    </View>
  );
}
