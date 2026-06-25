import { Tabs } from 'expo-router';
import { Home, LandPlot, Map, User, Watch } from 'lucide-react-native';
import { View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='map'
          options={{
            title: 'Map',
            tabBarIcon: ({ size, color }) => <Map size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='challenges'
          options={{
            title: 'Challenges',
            tabBarIcon: ({ size, color }) => (
              <LandPlot size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='history'
          options={{
            title: 'History',
            tabBarIcon: ({ size, color }) => (
              <Watch size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
