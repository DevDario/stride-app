import { render } from '@testing-library/react-native';
import React from 'react';

import { ChallengesScreen } from '../screens/ChallengesScreen';

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

jest.mock('react-native-svg', () => ({
  Svg: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Polyline: () => null,
}));

jest.mock('../components/ChallengeDetailSheet', () => ({
  __esModule: true,
  ChallengeDetailSheet: () => null,
  ChallengeDetailSheetRef: {},
}));

jest.mock('../hooks/useChallengesViewModel', () => ({
  useChallengesViewModel: () => ({
    challenges: [
      {
        id: '1',
        title: 'Samba Loop Challenge',
        creatorHandle: '@Runner_X441',
        distance: 10,
        timeGoal: '00:45:00',
        participantCount: 128,
        isFeatured: true,
        routeCoordinates: [
          [13.234, -8.839],
          [13.237, -8.841],
        ],
        endsAt: '2026-07-15T23:59:59Z',
        status: 'active',
        distanceFromUser: null,
      },
    ],
    activeFilter: 'all',
    setActiveFilter: jest.fn(),
    selectedChallenge: null,
    sheetRef: { current: null },
    handleAccept: jest.fn(),
    handleViewRoute: jest.fn(),
    handleSheetClose: jest.fn(),
    renderItem: ({ item }: { item: any }) => {
      const { Text } = require('../../../components/Text');
      return <Text>{item.title}</Text>;
    },
    keyExtractor: (item: any) => item.id,
    isEmpty: false,
    isLoading: false,
  }),
}));

describe('ChallengesScreen', () => {
  it('renders the header title', () => {
    const { getByText } = render(<ChallengesScreen />);
    expect(getByText('Challenges')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    const { getByText } = render(<ChallengesScreen />);
    expect(getByText('Find your next challenge')).toBeTruthy();
  });

  it('renders the filter chips', () => {
    const { getByText } = render(<ChallengesScreen />);
    expect(getByText('All')).toBeTruthy();
  });
});
