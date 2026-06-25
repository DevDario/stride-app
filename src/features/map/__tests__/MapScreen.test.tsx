import { render } from '@testing-library/react-native';
import React from 'react';

import { MapScreen } from '../screens/MapScreen';

jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      surface: '#eee',
      border: '#ddd',
      primary: '#10B981',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    radii: { sm: 4, md: 8, lg: 16, full: 9999 },
    typography: { sizes: { lg: 18, sm: 14 }, weights: { bold: '700' } },
  }),
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const MockBottomSheet = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  return {
    __esModule: true,
    default: MockBottomSheet,
    BottomSheetView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    BottomSheetScrollView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

jest.mock('@maplibre/maplibre-react-native', () => ({
  Map: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Camera: () => null,
  Marker: () => null,
  UserLocation: () => null,
  GeoJSONSource: () => null,
  Layer: () => null,
  Images: () => null,
}));

jest.mock('../../../components/map/MapView', () => ({
  __esModule: true,
  StrideMapView: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  MAP_STYLES: { dark: 'dark' },
}));

jest.mock('../../../components/map/PermissionGate', () => ({
  PermissionGate: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('../../../components/map/UserLocationDot', () => ({
  UserLocationDot: () => null,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../map/store/locationStore', () => ({
  useLocationStore: () => ({
    lastKnownLatitude: null,
    lastKnownLongitude: null,
  }),
}));

jest.mock('../../map/hooks/useMapViewModel', () => ({
  __esModule: true,
  useMapViewModel: () => ({
    mapRef: { current: null },
    postRunSheetRef: { current: null },
    countdownKey: -1,
    overlayOpacity: 1,
    selectedArea: null,
    tracking: {
      state: 'idle',
      isRunning: false,
      isPaused: false,
      isLocked: false,
      isFinished: false,
      elapsedTime: 0,
      distance: 0,
      pace: 0,
      coordinates: [],
      challengeId: undefined,
      lastCoordinate: null,
      startLocationUpdates: jest.fn(),
      beginRun: jest.fn(),
      pauseRun: jest.fn(),
      resumeRun: jest.fn(),
      stopRun: jest.fn(),
      resetRun: jest.fn(),
      setIsLocked: jest.fn(),
      addCoordinate: jest.fn(),
    },
    activeLayers: new Set(['areaRatings']),
    toggleLayer: jest.fn(),
    challenges: [],
    routes: [],
    records: [],
    isActive: false,
    isIdle: true,
    handleMapPress: jest.fn(),
    handleStart: jest.fn(),
    handleCountdownComplete: jest.fn(),
    handlePauseResume: jest.fn(),
    handleStop: jest.fn(),
    handlePostRunClose: jest.fn(),
    handleToggleLock: jest.fn(),
  }),
  LUANDA_DISTRICTS: [],
  DEFAULT_ZOOM: 13,
}));

jest.mock('../../../utils/geo', () => ({
  chaikinSmooth: (polygon: any) => polygon,
}));

jest.mock('../components/AreaOverlayLabel', () => ({
  AreaOverlayLabel: () => null,
}));

jest.mock('../components/ChallengesLayer', () => ({
  ChallengesLayer: () => null,
}));

jest.mock('../components/MapLayersBottomSheet', () => ({
  MapLayersBottomSheet: () => null,
}));

jest.mock('../components/PostRunBottomSheet', () => ({
  PostRunBottomSheet: () => null,
}));

jest.mock('../components/RecordsLayer', () => ({
  RecordsLayer: () => null,
}));

jest.mock('../components/RoutesLayer', () => ({
  RoutesLayer: () => null,
}));

jest.mock('../components/RunControlButtons', () => ({
  RunControlButtons: () => null,
}));

jest.mock('../components/RunStatsOverlay', () => ({
  RunStatsOverlay: () => null,
}));

describe('MapScreen', () => {
  it('renders the Start Run button when idle', () => {
    const { getByText } = render(<MapScreen />);
    expect(getByText('Start Run')).toBeTruthy();
  });
});
