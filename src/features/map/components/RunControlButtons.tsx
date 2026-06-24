import { Lock, LockOpen, Pause, Play, Square } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface RunControlButtonsProps {
  isPaused: boolean;
  isLocked: boolean;
  onPauseResume: () => void;
  onStop: () => void;
  onToggleLock: () => void;
}

export function RunControlButtons({
  isPaused,
  isLocked,
  onPauseResume,
  onStop,
  onToggleLock,
}: RunControlButtonsProps) {
  const overallOpacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const lockOverlayOpacity = useSharedValue(0);

  useEffect(() => {
    overallOpacity.value = withTiming(1, { duration: 400 });
    scale.value = withTiming(1, { duration: 400 });
  }, [overallOpacity, scale]);

  useEffect(() => {
    lockOverlayOpacity.value = withTiming(isLocked ? 1 : 0, { duration: 300 });
  }, [isLocked, lockOverlayOpacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: overallOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: lockOverlayOpacity.value,
  }));

  const lockGesture = isLocked
    ? Gesture.LongPress()
        .minDuration(600)
        .onEnd((_e, success) => {
          if (success) runOnJS(onToggleLock)();
        })
    : Gesture.Tap().onEnd(() => {
        runOnJS(onToggleLock)();
      });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.dock, animatedContainerStyle]}>
        <Pressable
          onPress={onPauseResume}
          disabled={isLocked}
          style={({ pressed }) => [
            styles.dockButton,
            { opacity: isLocked ? 0.35 : pressed ? 0.7 : 1 },
          ]}
        >
          {isPaused ? (
            <Play size={24} color='#FFFFFF' fill='#FFFFFF' />
          ) : (
            <Pause size={24} color='#FFFFFF' />
          )}
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          onPress={onStop}
          disabled={isLocked}
          style={({ pressed }) => [
            styles.dockButton,
            { opacity: isLocked ? 0.35 : pressed ? 0.7 : 1 },
          ]}
        >
          <Square size={22} color='#EF4444' fill='#EF4444' />
        </Pressable>

        <View style={styles.divider} />

        <GestureDetector gesture={lockGesture}>
          <Pressable
            style={({ pressed }) => [
              styles.dockButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            {isLocked ? (
              <Lock size={24} color='#FFFFFF' />
            ) : (
              <LockOpen size={24} color='#FFFFFF' />
            )}
          </Pressable>
        </GestureDetector>
      </Animated.View>

      {isLocked && (
        <Animated.View
          style={[styles.overlay, overlayAnimatedStyle]}
          pointerEvents='none'
        >
          <Text style={styles.overlayText}>Hold to unlock</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 50,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 40,
    paddingHorizontal: 30,
    paddingVertical: 22,
    gap: 0,
  },
  dockButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
