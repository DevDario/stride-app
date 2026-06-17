import { UserLocation } from '@maplibre/maplibre-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const DOT_SIZE = 20;
const PULSE_SIZE = 50;

function AnimatedPulse() {
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 2000 }),
        withTiming(0.4, { duration: 2000 })
      ),
      -1,
      true
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: PULSE_SIZE,
          height: PULSE_SIZE,
          borderRadius: PULSE_SIZE / 2,
          backgroundColor: '#3B82F6',
          position: 'absolute',
          top: -15,
          left: -15,
        },
        animatedStyle,
      ]}
    />
  );
}

export function UserLocationDot() {
  return (
    <UserLocation>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: DOT_SIZE,
          height: DOT_SIZE,
        }}
      >
        <AnimatedPulse />
        <View
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            backgroundColor: '#3B82F6',
            borderWidth: 3,
            borderColor: '#FFFFFF',
          }}
        />
      </View>
    </UserLocation>
  );
}
