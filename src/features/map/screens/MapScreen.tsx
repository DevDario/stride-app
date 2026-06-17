import { AreaOverlay } from '@components/map/AreaOverlay';
import { StrideMapView } from '@components/map/MapView';
import type { StrideMapViewRef } from '@components/map/MapView';
import { PermissionGate } from '@components/map/PermissionGate';
import { UserLocationDot } from '@components/map/UserLocationDot';
import { useRouter } from 'expo-router';
import { ChevronLeft, Play } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocationStore } from 'src/features/map/store/locationStore';
import { useTheme } from 'src/theme/ThemeProvider';

type RunState = 'idle' | 'starting' | 'running';

const LUANDA_CENTER: [number, number] = [13.234444, -8.838333];
const DEFAULT_ZOOM = 13;

const LUANDA_DISTRICTS: {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  polygon: [number, number][];
}[] = [
  {
    id: 'ingombota',
    rating: 4,
    polygon: [
      [13.213196, -8.81764],
      [13.211806, -8.819584],
      [13.21264, -8.82125],
      [13.21375, -8.820416],
      [13.213196, -8.81764],
    ],
  },
  {
    id: 'samba',
    rating: 4,
    polygon: [
      [13.215542, -8.897736],
      [13.208619, -8.887589],
      [13.191729, -8.875343],
      [13.20334, -8.860922],
      [13.211, -8.848141],
      [13.214198, -8.837684],
      [13.221103, -8.827833],
      [13.214306, -8.827638],
      [13.214306, -8.831529],
      [13.210971, -8.831506],
      [13.209305, -8.837917],
      [13.207639, -8.836805],
      [13.203195, -8.837639],
      [13.205139, -8.853472],
      [13.199305, -8.865695],
      [13.193472, -8.872915],
      [13.180139, -8.880416],
      [13.177361, -8.883472],
      [13.176251, -8.888751],
      [13.183897, -8.894065],
      [13.189191, -8.904536],
      [13.215542, -8.897736],
    ],
  },
  {
    id: 'maianga',
    rating: 3,
    polygon: [
      [13.220179, -8.897079],
      [13.221802, -8.890549],
      [13.22072, -8.887845],
      [13.227559, -8.875751],
      [13.233857, -8.869453],
      [13.247149, -8.851524],
      [13.251824, -8.850288],
      [13.256615, -8.83688],
      [13.261482, -8.835919],
      [13.244327, -8.825812],
      [13.240851, -8.824091],
      [13.234398, -8.825057],
      [13.226786, -8.821155],
      [13.221103, -8.827833],
      [13.214198, -8.837684],
      [13.211, -8.848141],
      [13.20334, -8.860922],
      [13.191729, -8.875343],
      [13.208619, -8.887589],
      [13.215542, -8.897736],
      [13.220179, -8.897079],
    ],
  },
  {
    id: 'kilamba_kiaxi',
    rating: 3,
    polygon: [
      [13.319212, -8.906159],
      [13.313174, -8.899579],
      [13.302971, -8.892455],
      [13.305085, -8.886297],
      [13.31088, -8.878448],
      [13.304722, -8.874464],
      [13.311676, -8.864766],
      [13.28432, -8.847315],
      [13.275032, -8.843163],
      [13.261482, -8.835919],
      [13.256615, -8.83688],
      [13.251824, -8.850288],
      [13.247149, -8.851524],
      [13.233857, -8.869453],
      [13.227559, -8.875751],
      [13.22072, -8.887845],
      [13.221802, -8.890549],
      [13.220179, -8.897079],
      [13.240124, -8.891428],
      [13.253647, -8.881105],
      [13.258417, -8.879233],
      [13.260711, -8.900665],
      [13.265178, -8.902597],
      [13.319212, -8.906159],
    ],
  },
  {
    id: 'rangel',
    rating: 3,
    polygon: [
      [13.275032, -8.843163],
      [13.274718, -8.836904],
      [13.273826, -8.821304],
      [13.272506, -8.815201],
      [13.257991, -8.815275],
      [13.254776, -8.822595],
      [13.246244, -8.819801],
      [13.244327, -8.825812],
      [13.261482, -8.835919],
      [13.275032, -8.843163],
    ],
  },
  {
    id: 'sambizanga',
    rating: 2,
    polygon: [
      [13.272506, -8.815201],
      [13.272242, -8.812099],
      [13.275864, -8.806605],
      [13.277856, -8.799602],
      [13.287456, -8.798213],
      [13.309612, -8.783482],
      [13.309854, -8.778833],
      [13.303213, -8.755695],
      [13.29986, -8.756527],
      [13.289583, -8.764027],
      [13.284583, -8.775416],
      [13.284305, -8.783749],
      [13.282917, -8.785139],
      [13.280417, -8.784029],
      [13.279029, -8.785695],
      [13.277638, -8.784861],
      [13.277082, -8.790418],
      [13.273236, -8.795743],
      [13.270694, -8.795694],
      [13.269306, -8.797638],
      [13.264862, -8.799306],
      [13.255417, -8.796806],
      [13.252917, -8.799028],
      [13.24736, -8.799584],
      [13.24736, -8.795972],
      [13.24514, -8.79514],
      [13.242362, -8.801806],
      [13.245333, -8.803001],
      [13.247739, -8.801593],
      [13.251332, -8.802257],
      [13.25456, -8.806989],
      [13.252993, -8.809696],
      [13.24872, -8.810234],
      [13.246244, -8.819801],
      [13.254776, -8.822595],
      [13.257991, -8.815275],
      [13.272506, -8.815201],
    ],
  },
  {
    id: 'cazenga',
    rating: 3,
    polygon: [
      [13.311676, -8.864766],
      [13.320446, -8.854075],
      [13.323614, -8.849129],
      [13.322841, -8.848395],
      [13.320523, -8.847313],
      [13.322687, -8.840397],
      [13.317355, -8.833364],
      [13.3189, -8.831123],
      [13.304295, -8.831935],
      [13.299774, -8.836146],
      [13.295485, -8.834562],
      [13.274718, -8.836904],
      [13.275032, -8.843163],
      [13.28432, -8.847315],
      [13.311676, -8.864766],
    ],
  },
  {
    id: 'viana',
    rating: 1,
    polygon: [
      [13.323497, -9.131643],
      [13.343425, -9.072161],
      [13.379422, -9.060683],
      [13.363325, -9.041496],
      [13.364361, -9.016423],
      [13.396304, -8.976255],
      [13.443741, -9.020615],
      [13.493832, -8.983631],
      [13.532673, -8.993235],
      [13.536069, -8.940014],
      [13.478444, -8.897564],
      [13.45897, -8.882282],
      [13.436101, -8.869601],
      [13.383023, -8.854611],
      [13.363141, -8.83433],
      [13.320446, -8.854075],
      [13.305085, -8.886297],
      [13.322955, -8.907427],
      [13.310578, -8.951197],
      [13.312752, -8.998167],
      [13.299168, -9.106475],
      [13.323497, -9.131643],
    ],
  },
  {
    id: 'futungo_de_belas',
    rating: 4,
    polygon: [
      [13.19298, -8.934549],
      [13.199546, -8.923971],
      [13.208858, -8.920919],
      [13.214383, -8.915548],
      [13.220179, -8.897079],
      [13.215542, -8.897736],
      [13.189191, -8.904536],
      [13.183897, -8.894065],
      [13.176251, -8.888751],
      [13.172917, -8.897361],
      [13.169582, -8.900415],
      [13.160972, -8.90375],
      [13.160416, -8.907638],
      [13.158194, -8.90875],
      [13.159584, -8.927084],
      [13.15764, -8.928472],
      [13.159306, -8.92875],
      [13.170389, -8.927138],
      [13.174799, -8.935276],
      [13.178207, -8.936806],
      [13.19298, -8.934549],
    ],
  },
  {
    id: 'kilamba',
    rating: 5,
    polygon: [
      [13.285564, -9.023798],
      [13.289886, -8.998718],
      [13.290074, -8.974286],
      [13.288282, -8.971927],
      [13.253662, -8.972116],
      [13.227822, -9.023184],
      [13.285564, -9.023798],
    ],
  },
];

function CountdownNumber({
  value,
  onComplete,
}: {
  value: number;
  onComplete: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 0.4,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  }, []);

  return (
    <View style={countdownStyles.container}>
      <Animated.Text
        style={[
          countdownStyles.text,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {value}
      </Animated.Text>
    </View>
  );
}

const countdownStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 120,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
});

export function MapScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const mapRef = useRef<StrideMapViewRef>(null);
  const { lastKnownLatitude, lastKnownLongitude } = useLocationStore();
  const [runState, setRunState] = useState<RunState>('idle');
  const [countdownKey, setCountdownKey] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const animationRef = useRef<number | null>(null);

  const animateOverlayFade = useCallback(() => {
    const startTime = Date.now();
    const duration = 1500;

    function frame() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setOverlayOpacity(1 - progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(frame);
      }
    }
    animationRef.current = requestAnimationFrame(frame);
  }, []);

  function handleStart() {
    setRunState('starting');

    const lng = lastKnownLongitude ?? LUANDA_CENTER[0];
    const lat = lastKnownLatitude ?? LUANDA_CENTER[1];
    mapRef.current?.easeTo([lng, lat], DEFAULT_ZOOM, 60, 2000);

    animateOverlayFade();
  }

  function handleCountdownComplete() {
    const next = countdownKey + 1;
    if (next < 3) {
      setCountdownKey(next);
    } else {
      setCountdownKey(-1);
      setRunState('running');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PermissionGate>
        <StrideMapView ref={mapRef} zoomLevel={DEFAULT_ZOOM}>
          <UserLocationDot />

          {LUANDA_DISTRICTS.map((district) => (
            <AreaOverlay
              key={district.id}
              id={district.id}
              rating={district.rating}
              opacity={overlayOpacity}
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

      {runState === 'starting' && countdownKey >= 0 && (
        <CountdownNumber
          key={countdownKey}
          value={3 - countdownKey}
          onComplete={handleCountdownComplete}
        />
      )}

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

      {runState === 'idle' && (
        <Pressable
          onPress={handleStart}
          style={[
            startButtonStyles.button,
            { backgroundColor: colors.primary },
          ]}
        >
          <Play size={20} color='#FFFFFF' fill='#FFFFFF' />
          <Text style={startButtonStyles.label}>Start Run</Text>
        </Pressable>
      )}
    </View>
  );
}

const startButtonStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
