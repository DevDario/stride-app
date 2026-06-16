module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/features/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@api/(.*)$': '<rootDir>/src/services/api/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo.*|@expo.*|@react-navigation|@clerk|expo-router|nativewind|react-native-css-interop|lucide-react-native|react-native-mmkv|react-native-gifted-charts|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|react-native-worklets|react-native-svg|@tanstack|zustand|tailwind-merge|clsx|token-cache)/)',
  ],
};
