import { Tabs } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import { Home } from "lucide-react-native"

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => {
            return (
              <Home size={size} color={color} />
            )
          }
        }}
      />
    </Tabs>
  );
}
