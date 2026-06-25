import { AreaOverlay } from '@components/map/AreaOverlay';
import { StrideMapView } from '@components/map/MapView';
import { PermissionGate } from '@components/map/PermissionGate';
import { UserLocationDot } from '@components/map/UserLocationDot';
import { useRouter } from 'expo-router';
import { ChevronLeft, Play } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'src/theme/ThemeProvider';
import { chaikinSmooth } from 'src/utils/geo';

import { AreaOverlayLabel } from '../components/AreaOverlayLabel';
import { ChallengesLayer } from '../components/ChallengesLayer';
import { MapLayersBottomSheet } from '../components/MapLayersBottomSheet';
import { PostRunBottomSheet } from '../components/PostRunBottomSheet';
import { RecordsLayer } from '../components/RecordsLayer';
import { RoutesLayer } from '../components/RoutesLayer';
import { RunControlButtons } from '../components/RunControlButtons';
import { RunStatsOverlay } from '../components/RunStatsOverlay';
import {
  useMapViewModel,
  LUANDA_DISTRICTS,
  DEFAULT_ZOOM,
} from '../hooks/useMapViewModel';

function CountdownNumber({
  value,
  onComplete,
}: {
  value: number;
  onComplete: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 0.4,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={countdownStyles.container}>
      <Animated.Text
        style={[
          countdownStyles.text,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {value}
      </Animated.Text>
    </View>
  );
}

const countdownStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 120,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
});

export function MapScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    mapRef,
    postRunSheetRef,
    countdownKey,
    overlayOpacity,
    selectedArea,
    tracking,
    activeLayers,
    toggleLayer,
    challenges,
    routes,
    records,
    isActive,
    isIdle,
    handleMapPress,
    handleStart,
    handleCountdownComplete,
    handlePauseResume,
    handleStop,
    handlePostRunClose,
    handleToggleLock,
  } = useMapViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PermissionGate>
        <StrideMapView
          ref={mapRef}
          zoomLevel={DEFAULT_ZOOM}
          onPress={handleMapPress}
        >
          <UserLocationDot />

          {activeLayers.has('areaRatings') &&
            LUANDA_DISTRICTS.map((district) => (
              <AreaOverlay
                key={district.id}
                id={district.id}
                rating={district.rating}
                opacity={overlayOpacity}
                geoJson={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Polygon',
                    coordinates: [chaikinSmooth(district.polygon, 3)],
                  },
                }}
              />
            ))}

          {isIdle && activeLayers.has('challenges') && (
            <ChallengesLayer challenges={challenges} />
          )}

          {isIdle && activeLayers.has('routes') && (
            <RoutesLayer routes={routes} />
          )}

          {isIdle && activeLayers.has('records') && (
            <RecordsLayer records={records} />
          )}

          {selectedArea && (
            <AreaOverlayLabel
              key={selectedArea.areaId}
              areaId={selectedArea.areaId}
              rating={selectedArea.rating}
              centroid={selectedArea.centroid}
            />
          )}
        </StrideMapView>
      </PermissionGate>

      {countdownKey >= 0 && (
        <CountdownNumber
          key={countdownKey}
          value={3 - countdownKey}
          onComplete={handleCountdownComplete}
        />
      )}

      {isActive && (
        <RunStatsOverlay
          elapsedTime={tracking.elapsedTime}
          distance={tracking.distance}
          pace={tracking.pace}
          isPaused={tracking.isPaused}
        />
      )}

      {isIdle && (
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: insets.top + 8,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
      )}

      {isIdle && (
        <Pressable
          onPress={handleStart}
          style={[
            startButtonStyles.button,
            { backgroundColor: colors.primary },
          ]}
        >
          <Play size={20} color='#FFFFFF' fill='#FFFFFF' />
          <Text style={startButtonStyles.label}>Start Run</Text>
        </Pressable>
      )}

      {isActive && (
        <RunControlButtons
          isPaused={tracking.isPaused}
          isLocked={tracking.isLocked}
          onPauseResume={handlePauseResume}
          onStop={handleStop}
          onToggleLock={handleToggleLock}
        />
      )}

      {tracking.isFinished && (
        <PostRunBottomSheet
          ref={postRunSheetRef}
          elapsedTime={tracking.elapsedTime}
          distance={tracking.distance}
          pace={tracking.pace}
          coordinates={tracking.coordinates}
          challengeId={tracking.challengeId}
          onClose={handlePostRunClose}
        />
      )}

      <MapLayersBottomSheet
        activeLayers={activeLayers}
        onToggle={toggleLayer}
        visible={isIdle}
      />
    </View>
  );
}

const startButtonStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
