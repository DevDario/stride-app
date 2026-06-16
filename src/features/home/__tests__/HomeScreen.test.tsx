import { render } from '@testing-library/react-native';
import React from 'react';

import { HomeScreen } from '../screens/HomeScreen';

jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      text: '#000',
      surface: '#eee',
      border: '#ddd',
      primary: '#2D9B7F',
    },
    spacing: { sm: 8, md: 16, lg: 24, xl: 32 },
    radii: { md: 8 },
    typography: { sizes: { lg: 18 }, weights: { bold: '700' } },
  }),
}));

jest.mock('@widgets/WeeklyRunsResume', () => ({
  WeeklyRunsResume: () => <></>,
}));

jest.mock('../hooks/useHomeViewModel', () => ({
  useHomeViewModel: () => ({
    greeting: 'Welcome to Stride!',
    user: null,
    isLoading: false,
  }),
}));

describe('HomeScreen', () => {
  it('renders the header title', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Ready to get moving?')).toBeTruthy();
  });
});
