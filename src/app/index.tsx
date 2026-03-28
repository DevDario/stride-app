import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';

export default function AppEntry() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Mock loading for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/mascot/base.png')}
        style={{ width: 100, height: 100 }}
      />
      <ActivityIndicator size="small" color="#000" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});