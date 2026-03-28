import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { useHomeStore } from '../store/homeStore';

jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: { background: '#fff', text: '#000', surface: '#eee' },
    spacing: { md: 16, lg: 24, xl: 32 },
    typography: { sizes: { h2: 24 }, weights: { bold: 'bold' } },
  }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    useHomeStore.setState({ user: null, isLoading: false });
  });

  it('renders default greeting and handles loading correctly', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Welcome to Flit App!')).toBeTruthy();

    expect(screen.getByText('Guest')).toBeTruthy();
    expect(screen.getByText('No Role')).toBeTruthy();

    const reloadButton = screen.getByText('Reload User');
    fireEvent.press(reloadButton);
  });
});
