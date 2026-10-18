# Expo Go Workarounds — Restore Before Production Build

Stride targets Expo SDK 57. Day-to-day map and run-tracking work happens in
**Expo Go on an iPhone 12 mini**, which cannot load native modules that are not
part of Expo Go's bundled set. Several decisions on `feat/react-native-maps`
were relaxed so the app could be exercised there. Every one of them must be
revisited before an EAS production build.

Each entry lists **what changed**, **why it was relaxed**, and **what to do**.

---

## 1. Map renderer: `react-native-maps` instead of MapLibre

**What changed.** `@maplibre/maplibre-react-native` was removed and replaced
with `react-native-maps@1.27.2`. MapLibre is not in Expo Go's bundled module
set, so it can only load in a dev client.

**Consequences.**

- **No custom dark basemap on iOS.** `customMapStyle` is a Google Maps API.
  On iOS, `react-native-maps` uses Apple MapKit, which ignores it. The
  `DARK_MAP_STYLE` array in `src/components/map/MapView.tsx` currently only
  affects Android.
- **No freeform GeoJSON overlays.** MapLibre's `GeoJSONSource` + `Layer` was
  replaced with per-polygon `Polygon` components in `AreaOverlay.tsx`. That
  works, but the choropleth design assumes adjacent polygons can merge once
  coverage is dense; MapLibre's native GeoJSON layer handled that for free.
- **No `animateToRegion` pitch.** See §2.

**To restore.** Decide whether MapLibre is worth a dev-client requirement. If
yes: reinstall `@maplibre/maplibre-react-native`, restore the `Map`/`Camera`
components in `MapView.tsx`, restore the `GeoJSONSource` overlay in
`AreaOverlay.tsx`, re-add the config plugin to `app.json` under `plugins`, and
re-add `@maplibre/maplibre-react-native` to the Jest mock in
`src/features/map/__tests__/MapScreen.test.tsx`. If no: keep
`react-native-maps` and set the provider to Google Maps on iOS so
`customMapStyle` works, which requires a Google Maps API key.

---

## 2. Tilt / pitch dropped on run start

**What changed.** `StrideMapViewRef.easeTo()` accepts a `pitch` argument but
ignores it (`_pitch?: number` in `MapView.tsx`). `animateToRegion` cannot
express pitch.

**To restore.** Use `MapView.animateCamera()`, which takes a `Camera` with
`{ center, zoom, pitch }`:

```ts
easeTo: (center, zoom = DEFAULT_ZOOM, pitch = 0, duration = 2000) => {
  const map = mapRef.current;
  if (!map) return;
  if (pitch > 0) {
    map.animateCamera(
      { center: { latitude: center[1], longitude: center[0] }, zoom, pitch },
      { duration }
    );
  } else {
    map.animateToRegion(toRegion(center, zoom), duration);
  }
},
```

Call sites already pass `45` on start and `0` on stop
(`useMapViewModel.ts`, `handleStart` / `handleStop`), so no caller changes are
needed.

**Caveat.** Pitch is a no-op on Android's default provider; it needs Google
Maps. On iOS Apple MapKit it works.

---

## 3. Background location is soft-required

**What changed.** `handleStart` in `src/features/map/hooks/useMapViewModel.ts`
hard-requires **foreground** location, then attempts background inside a
`try/catch` that swallows failure. Previously it blocked the run outright if
background permission was not granted.

**Why.** Expo Go does not reliably carry `NSLocationAlwaysAndWhenInUseUsageDescription`,
so `getBackgroundPermissionsAsync()` rejects with `ERR_LOCATION_INFO_PLIST`.
Making it strict prevented any run from starting in Expo Go.

**To restore.** Reintroduce the hard gate. Background tracking is the product
requirement — a run tracker that stops recording the moment the screen locks
does not deliver its core promise. Keep foreground as the minimum to start,
but refuse to start a run without background on production builds.

Onboarding now collects background permission on its own
(`src/app/(setup)/permissions.tsx`, phase `background`), so most users will
already have granted it. The gate still matters for users who skip that step
or revoke later.

The same `try/catch` should be kept for the platform case, but the failure path
must surface a blocking alert rather than silently proceeding.

---

## 4. Android foreground service not configured

**What changed.** Nothing — this was never configured. Listed here because it
blocks Android production builds.

**The gap.** `src/features/map/hooks/useRunTracking.ts` passes
`foregroundService` in `LOCATION_TASK_OPTIONS`, and `app.json` declares
`FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_LOCATION` and `POST_NOTIFICATIONS`
under `android.permissions`. But the `expo-location` config plugin is not
given an `androidForegroundServiceIcon`, and
`isAndroidForegroundServiceEnabled` is not set. The plugin's
`withForegroundServiceIcon` helper needs that value to generate the
`location_foreground_service_icon` drawable resources; without it, Android 13+
fails to start the notification-backed service.

**To restore.** Add to the `expo-location` plugin config in `app.json`:

```json
[
  "expo-location",
  {
    "isAndroidForegroundServiceEnabled": true,
    "androidForegroundServiceIcon": "./src/assets/images/adaptive-icon.png",
    "...": "keep the existing three iOS permission strings"
  }
]
```

The icon must be a monochrome silhouette; Android applies the notification
tint.

---

## 5. Run persistence on AsyncStorage, not MMKV

**What changed.** Completed runs are persisted with `@react-native-async-storage/async-storage`
via Zustand's `persist` middleware in `src/features/map/run/RunSession.ts`.
MMKV was removed from `package.json` and is not currently used anywhere in `src/`.

**Why.** AsyncStorage ships in Expo Go; MMKV does not.

**To restore.** Swap the storage adapter to MMKV's
`zustand/middleware` `createJSONStorage` wrapper around `createMMKV` from
`react-native-mmkv`. MMKV is synchronous, so this also removes the rehydration
race. Reinstall with `npx expo install react-native-mmkv` rather than `pnpm add`,
to keep the SDK-compatible version.

---

## 6. Live-run recovery still missing

**What changed.** Nothing yet — this is an open gap, tracked here because it
survives the storage swap.

**The problem.** `LOCATION_TASK` in `src/tasks/locationTask.ts` reads the run
session via `getRunSessionState()`, which is `useRunSessionStore.getState()`.
That store is in-memory. If iOS cold-starts the app to deliver a background
location event, the store rehydrates as `state: 'idle'` and the handler's
`if (session.state !== 'running') return;` silently discards every coordinate
for the remainder of the run.

Persistence currently covers **completed** runs only (`partialize` excludes the
in-flight session), so a mid-run app kill still loses that run.

**To restore.** Persist the live session too, and reconcile on rehydration: if
a persisted session is `running` with a `startedAt` in the past, either resume
it or finalize it as interrupted and write a completed record. This is where
MMKV's synchronous reads matter — the background task cannot await an async
storage round-trip.

---

## 7. Keep — not an Expo Go workaround

`import '../tasks/locationTask'` in `src/app/_layout.tsx` was added because
`expo-task-manager` requires `defineTask` to register at app entry, not when a
map hook happens to mount. Background wake-ups need the task registered at
launch. **Do not remove this.**

---

## Production checklist

- [ ] Decide MapLibre vs `react-native-maps` + Google Maps provider (§1)
- [ ] Restore `easeTo` pitch via `animateCamera` (§2)
- [ ] Re-harden the background location gate in `handleStart` (§3)
- [ ] Configure `androidForegroundServiceIcon` + `isAndroidForegroundServiceEnabled` (§4)
- [ ] Swap AsyncStorage → MMKV (§5)
- [ ] Implement live-run recovery for cold-started background events (§6)
- [ ] Verify `UIBackgroundModes` includes `location` in the built `Info.plist`
      (the `expo-location` plugin injects this automatically)
- [ ] Verify `NSLocationAlwaysAndWhenInUseUsageDescription` lands in the built
      `Info.plist`
- [ ] Re-test run tracking with the phone locked for 10+ minutes
