import type { StrideMapViewRef } from '@components/map/MapView';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert as RNAlert, Linking } from 'react-native';
import { useLocationStore } from 'src/features/map/store/locationStore';
import { pointInPolygon } from 'src/utils/geo';

import { useChallengesData } from './useChallengesData';
import { useMapLayers } from './useMapLayers';
import { useRecordsData } from './useRecordsData';
import { useRoutesData } from './useRoutesData';
import { useRunTracking } from './useRunTracking';
import type { PostRunBottomSheetRef } from '../components/PostRunBottomSheet';

export const LUANDA_CENTER: [number, number] = [13.234444, -8.838333];
export const DEFAULT_ZOOM = 13;

export interface LuandaDistrict {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  polygon: [number, number][];
}

export const LUANDA_DISTRICTS: LuandaDistrict[] = [
  {
    id: 'ingombota',
    name: 'Ingombota',
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
    name: 'Samba',
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
    name: 'Maianga',
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
    name: 'Kilamba Kiaxi',
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
    name: 'Rangel',
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
    name: 'Sambizanga',
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
    name: 'Cazenga',
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
    name: 'Viana',
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
    name: 'Futungo de Belas',
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
    name: 'Kilamba',
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

export function polygonCentroid(polygon: [number, number][]): [number, number] {
  const n = polygon.length;
  const sum = polygon.reduce(
    (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
    [0, 0]
  );
  return [sum[0] / n, sum[1] / n];
}

export function useMapViewModel() {
  const mapRef = useRef<StrideMapViewRef>(null);
  const postRunSheetRef = useRef<PostRunBottomSheetRef>(null);
  const { lastKnownLatitude, lastKnownLongitude } = useLocationStore();

  const [countdownKey, setCountdownKey] = useState(-1);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const animationRef = useRef<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<{
    areaId: string;
    rating: number;
    centroid: [number, number];
  } | null>(null);

  const tracking = useRunTracking();
  const { activeLayers, toggleLayer } = useMapLayers();
  const { challenges } = useChallengesData(activeLayers.has('challenges'));
  const { routes } = useRoutesData(activeLayers.has('routes'));
  const { records } = useRecordsData(activeLayers.has('records'));

  const isActive = tracking.state === 'running' || tracking.state === 'paused';
  const isIdle = tracking.state === 'idle';

  const animateOverlayTo = useCallback(
    (targetOpacity: number, duration: number) => {
      const startTime = Date.now();
      const startOpacity = overlayOpacity;

      function frame() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setOverlayOpacity(
          startOpacity + (targetOpacity - startOpacity) * progress
        );
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(frame);
        }
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(frame);
    },
    [overlayOpacity]
  );

  const handleMapPress = useCallback(
    (e: any) => {
      if (!isIdle || !activeLayers.has('areaRatings')) return;
      const ll = e.nativeEvent.lngLat;
      const lng = Array.isArray(ll) ? ll[0] : ll.lng;
      const lat = Array.isArray(ll) ? ll[1] : ll.lat;

      const district = LUANDA_DISTRICTS.find((d) =>
        pointInPolygon([lng, lat], d.polygon)
      );

      if (district) {
        setSelectedArea({
          areaId: district.id,
          rating: district.rating,
          centroid: polygonCentroid(district.polygon),
        });
      } else {
        setSelectedArea(null);
      }
    },
    [isIdle, activeLayers]
  );

  const handleStart = useCallback(async () => {
    const bg = await Location.getBackgroundPermissionsAsync();
    if (!bg.granted) {
      if (!bg.canAskAgain) {
        await new Promise<void>((resolve) => {
          RNAlert.alert(
            'Background location needed',
            'Enable "Allow all the time" location in Settings to track runs in the background.',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve() },
              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                  resolve();
                },
              },
            ]
          );
        });
        return;
      }
      const result = await Location.requestBackgroundPermissionsAsync();
      if (!result.granted) return;
    }

    const started = await tracking.startLocationUpdates();
    if (!started) {
      RNAlert.alert(
        'Could not start run',
        'Make sure location is enabled and try again.'
      );
      return;
    }

    setCountdownKey(0);

    const lng = lastKnownLongitude ?? LUANDA_CENTER[0];
    const lat = lastKnownLatitude ?? LUANDA_CENTER[1];
    mapRef.current?.easeTo([lng, lat], DEFAULT_ZOOM, 45, 2000);

    animateOverlayTo(0.2, 1500);
  }, [lastKnownLatitude, lastKnownLongitude, tracking, animateOverlayTo]);

  const handleCountdownComplete = useCallback(() => {
    setCountdownKey((prev) => {
      const next = prev + 1;
      if (next < 3) return next;
      tracking.beginRun();
      return -1;
    });
  }, [tracking]);

  const handlePauseResume = useCallback(() => {
    if (tracking.isPaused) {
      tracking.resumeRun();
    } else {
      tracking.pauseRun();
    }
  }, [tracking]);

  const handleStop = useCallback(async () => {
    await tracking.stopRun();
    animateOverlayTo(1, 800);
    mapRef.current?.easeTo(
      [
        lastKnownLongitude ?? LUANDA_CENTER[0],
        lastKnownLatitude ?? LUANDA_CENTER[1],
      ],
      DEFAULT_ZOOM,
      0,
      1000
    );

    if (postRunSheetRef.current) {
      setTimeout(() => postRunSheetRef.current!.open(), 500);
    }
  }, [tracking, animateOverlayTo, lastKnownLatitude, lastKnownLongitude]);

  const handlePostRunClose = useCallback(() => {
    tracking.resetRun();
    setSelectedArea(null);
  }, [tracking]);

  const handleToggleLock = useCallback(() => {
    tracking.setIsLocked(!tracking.isLocked);
  }, [tracking]);

  useEffect(() => {
    if (tracking.isRunning && tracking.lastCoordinate) {
      mapRef.current?.easeTo(
        [tracking.lastCoordinate.longitude, tracking.lastCoordinate.latitude],
        undefined,
        45,
        1500
      );
    }
  }, [tracking.lastCoordinate, tracking.isRunning]);

  return {
    mapRef,
    postRunSheetRef,
    countdownKey,
    overlayOpacity,
    selectedArea,
    tracking,
    activeLayers,
    toggleLayer,
    challenges,
    routes,
    records,
    isActive,
    isIdle,
    handleMapPress,
    handleStart,
    handleCountdownComplete,
    handlePauseResume,
    handleStop,
    handlePostRunClose,
    handleToggleLock,
  };
}
