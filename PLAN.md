# Stride App — Plan

## Architecture

- **Routing**: Expo Router v4 file-based routing in `src/app/`
- **Auth**: Clerk Expo v3 (`@clerk/expo`) with token cache via `expo-secure-store`
- **State**: Zustand (local/UI state), TanStack React Query (server state)
- **Onboarding metadata**: Stored in Clerk `unsafeMetadata.onboardingComplete` (client-writable metadata field)

### Route groups & gating

| Group          | Gating                                                 | Purpose                                       |
| -------------- | ------------------------------------------------------ | --------------------------------------------- |
| `(marketing)/` | Public                                                 | Splash, onboard-1..4, login, signup           |
| `(setup)/`     | Signed in, `unsafeMetadata.onboardingComplete` falsy   | know-you, frequency, schedule, level, welcome |
| `(tabs)/`      | Signed in + `unsafeMetadata.onboardingComplete` truthy | home, map, challenges, history, profile       |

Auth gating is in `src/app/_layout.tsx` (AuthGuard), `(setup)/_layout.tsx`, and `(app)/_layout.tsx` (which gates `(tabs)`).

### Key design decisions

- **CustomEvent polyfill**: Clerk SDK uses `CustomEvent` internally. React Native (Hermes) doesn't expose it globally. Polyfill is placed at the top of `_layout.tsx` (before any Clerk import) to ensure it's available when Clerk initializes.
- **OAuth flow**: Uses `useSSO` hook from `@clerk/expo` which calls `WebBrowser.openAuthSessionAsync()` (native Chrome Custom Tabs on Android, ASWebAuthenticationSession on iOS). The redirect URL is handled internally by `openAuthSessionAsync` — **no callback route needed**. No `navigate` callback passed to `setActive` (native pattern from Clerk docs).
- **Finalize navigation**: After `signIn.finalize()` / `signUp.finalize()`, navigate directly to the intended route with `router.replace()` — never use `decorateUrl` which injects a Safari ITP redirect URL (web-only).
- **Onboarding flag**: Stored in `unsafeMetadata` (client-writable via `user.update()`). All guard files check `unsafeMetadata.onboardingComplete`, NOT `publicMetadata` (server-only).

## Work done

### 0. Prerequisites

- Installed `expo-auth-session` + `expo-crypto` (required by `useSSO` hook)

### 1. OAuth — `window.dispatchEvent is not a function` (FIXED)

**Root cause**: `login.tsx` / `signup.tsx` used `signIn.sso()` / `signUp.sso()` — Clerk's web popup SSO API that calls `window.dispatchEvent`. React Native has no `window`.
**Fix**: Replaced with `useSSO` hook + `WebBrowser.openAuthSessionAsync()`. Dropped `global.CustomEvent` polyfill from both screens (moved to root `_layout.tsx`).

### 2. "Unmatched route" after email+password login (FIXED)

**Root cause**: `finalize({ navigate: ({ decorateUrl }) => ... })` used `decorateUrl()` which injects Clerk's Safari ITP redirect URL (absolute `https://...`). `router.replace(externalHttpUrl)` caused "unmatched route".
**Fix**: Navigate directly with `router.replace('/(tabs)/home')` / `router.replace('/(setup)/know-you')` — never call `decorateUrl` in React Native.

### 3. OAuth login — deep link causing "Unmatched route" (NO FIX NEEDED)

**Root cause**: After OAuth completes, `openAuthSessionAsync` captures `strideapp://oauth-callback?...`. On Android, the Chrome Custom Tab redirect fires an intent that Expo Router tried to intercept.
**Resolution**: No callback route needed. The native `openAuthSessionAsync` handles the redirect internally via activity result / ASWebAuthenticationSession callback. The `oauth-callback.tsx` workaround was deleted.

### 4. Onboarding not persisting after reload (FIXED)

**Root cause**: `useOnboardingComplete.ts` saves `onboardingComplete` to `unsafeMetadata`, but all guard files checked `publicMetadata` (always `undefined` from client side — server-only field).
**Fix**: All 3 guards now check `unsafeMetadata.onboardingComplete`.

### 5. Blank screen after changes (FIXED)

**Root cause**: Removing `global.CustomEvent` polyfill from `login.tsx`/`signup.tsx` caused Clerk initialization to fail. Expo Router eagerly loads route modules, so when the polyfill-free version ran before ClerkProvider mounted, Clerk tried to create a `CustomEvent` and crashed.
**Fix**: Moved `global.CustomEvent` polyfill to the top of `_layout.tsx` (before any Clerk import) so it's always available during initialization.

### 6. Nearby Challenges widget (DONE)

- Created `ChallengeCard` component at `src/components/ChallengeCard.tsx` — 220x250 card with MapPin icon, challenge name, creator, location, time-to-beat, distance, and "Beat it" CTA button
- Created `NearbyChallenges` widget at `src/widgets/NearbyChallenges/` with:
  - `types.ts` — `NearbyChallenge` & `NearbyChallengesParams` interfaces
  - `api/fetchNearbyChallenges.ts` — typed API function via `apiClient` + mock fallback data (6 Luanda-localized challenges)
  - `hooks/useNearbyChallenges.ts` — React Query hook using `useQuery` with `placeholderData` (mock data shown while API loads)
  - `ui/NearbyChallenges.tsx` — horizontal `FlatList` rendering `ChallengeCard` components
- Wired into `HomeScreen` after the "Nearby Challenges" section title

### 7. Recent Runs widget (DONE)

- Created `RunHistoryCard` component at `src/components/RunHistoryCard.tsx` — full-width card with Clock icon, duration, day+start-time (left), distance + finish-time (right); clickable via `onPress` prop
- Created `RecentRuns` widget at `src/widgets/RecentRuns/` with:
  - `types.ts` — `RunHistoryRecord` interface
  - `api/fetchRecentRuns.ts` — typed API function via `apiClient` + 5 mock runs (Today, Yesterday, and recent dates)
  - `hooks/useRecentRuns.ts` — React Query hook with mock data
  - `ui/RecentRuns.tsx` — vertical `.map()` list of `RunHistoryCard` components (no nested FlatList to avoid ScrollView conflicts)
- Wired into `HomeScreen` after the "Your recent runs" section title
- Empty state handled: shows `ClipboardList` icon + "No runs recorded yet" when list is empty

### 8. WeeklyRunsResume API layer & empty state (DONE)

- Created `types.ts` — `WeeklyRunEntry` & `WeeklyRunSummary` interfaces
- Created `api/fetchWeeklyResume.ts` — typed API function via `apiClient` + mock summary (chart data, totalDistance, calories, etc.)
- Created `hooks/useWeeklyRunsResumeWidget.ts` — React Query hook replacing the empty stub
- Updated `ui/WeeklyRunsResume.tsx` — consumes hook data instead of hardcoded values; empty state shows `Footprints` icon + "No runs this week yet"
- Empty state conventions documented in AGENTS.md

### 9. Map infrastructure (DONE)

- Installed `@maplibre/maplibre-react-native` + `expo-location` with app.json plugin configs
- Created `src/services/map/osrmClient.ts` — Axios client + typed functions for OSRM routes and geocoding
- Created `src/features/map/store/locationStore.ts` — Zustand store for permission state + last known location
- Created `src/components/map/PermissionGate.tsx` — permission request flow (foreground + background) with fallback/retry/settings
- Created `src/components/map/MapView.tsx` — maplibre `Map` wrapper with Camera ref, `forwardRef` + `useImperativeHandle` for imperative camera methods
- Created `src/components/map/MapMarker.tsx` — animated marker with Reanimated scale pulse
- Created `src/components/map/UserLocationDot.tsx` — custom blue dot with animated accuracy pulse via `UserLocation`
- Created `src/components/map/AreaOverlay.tsx` — GeoJSON region overlay with color-coded fill/outline (rating 1-5)
- Created `src/components/map/RouteLine.tsx` — route line from OSRM GeoJSON coordinates
- Created `src/features/map/hooks/useUserLocation.ts` — permission + GPS tracking hook
- Created `src/features/map/hooks/useMapRegion.ts` — viewport state management
- Created `src/features/map/screens/MapScreen.tsx` — orchestrates map with Luanda district overlays + back button + recenter FAB
- Created `src/app/(tabs)/map.tsx` — route file rendering `MapScreen`

#### Map fixes & refinements

- **Android crash**: Added `androidView="texture"` to Map — GLSurfaceView default caused `onDidFinishLoadingStyle` exception on some devices/emulators
- **v11 API compliance**: Fixed `shape`→`data` on GeoJSONSource, `style`→`paint` on Layer, added `type` prop on Layer
- **Map styles**: Created `MAP_STYLES` constant with CARTO dark/light/fallback options; default is `MAP_STYLES.dark`
- **Recentering**: Exposed `StrideMapViewRef` with `flyTo()` via `forwardRef`; FAB now recenters to user's actual location (falls back to Luanda center if no location known)
- **Real district overlays**: Replaced 4-point rectangles with actual GeoJSON polygons from Angola ADM3 geoBoundaries — 10 Luanda communes (Ingombota, Samba, Maianga, Kilamba Kiaxi, Rangel, Sambizanga, Cazenga, Viana, Futungo de Belas, Kilamba) with real boundary coordinates
- **UserLocationDot**: Switched from maplibre `UserLocation` (native engine, broken on emulator) to `MapMarker` + `expo-location` data from `useLocationStore` — works on emulator with mock GPS
- **Overlay/choropleth logic documented** in AGENTS.md: rendered per location+radius with ≥20 feedbacks, color starts at 2–3 feedbacks (low opacity), fully opaque at 20+. Future merging/adjacency for dense coverage.
- **District dataset source documented** in AGENTS.md: geoBoundaries ADM3, CC-BY 3.0
- Tab labels hidden (`tabBarShowLabel: false`)

#### TypeScript fixes

- **Camera ref type**: Changed `useRef<Camera>` → `useRef<any>` (Camera is a component, not a ref type — can't use it as a generic parameter)
- **onPress removed**: `MapViewProps.onPress` had a custom signature (`{ geometry: { coordinates } }`) that mismatched maplibre's `NativeSyntheticEvent<PressEvent>`; removed since it wasn't being consumed anywhere
- **RouteLine paint → layout**: Moved `line-cap` and `line-join` from `paint` to `layout` — these are layout properties per the MapLibre style spec, causing `Object literal may only specify known properties` TS error

#### Start button (replaces recenter FAB)

- Removed the Navigation-icon recenter button (bottom-right FAB)
- Added a centered "Start Run" pill button at the bottom with `Play` icon + label
- On press: map tilts to 60° pitch over 2s via `StrideMapViewRef.easeTo()`, district overlays smoothly fade out over 1.5s via `requestAnimationFrame`, countdown (3→2→1) plays with animated scale + opacity per number
- After countdown, `runState` transitions to `'running'` — button, countdown, overlays are gone, map stays tilted
- `StrideMapViewRef` gained `easeTo(center, zoom?, pitch?, duration?)` for smooth camera transitions
- **Error fix**: `startRun()` was not awaited in `handleStart()` → uncaught promise rejection crashed the run flow. Now awaited with try-catch; returns `boolean` — failure prevents countdown from starting.

#### Foreground service & permissions (DONE)

- Added `FOREGROUND_SERVICE` and `POST_NOTIFICATIONS` to `app.json` Android permissions to allow foreground service notification for run tracking
- Added `ACCESS_BACKGROUND_LOCATION` + `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION` alongside
- `startLocationUpdatesAsync` now works without crash
- `startRun()`, `pauseRun()`, `resumeRun()` all wrapped in try-catch returning `Promise<boolean>` — callers (MapScreen) check the return before proceeding

#### Chaikin smoothing for area overlays (DONE)

- Created `src/utils/geo.ts` with `chaikinSmooth(polygon, iterations)` implementing Chaikin's corner-cutting algorithm (25/75 subdivision, 3 iterations)
- Applied to all Luanda district polygons in MapScreen before passing to AreaOverlay — eliminates jagged GeoJSON edges without external dependencies

#### Onboarding permission UX (DONE)

- All device permissions (location foreground, notifications) are now requested during the onboarding flow — before the user ever reaches the map
- Created `src/app/(setup)/permissions.tsx` — a two-phase screen inserted between `level` and `welcome`:
  1. **Location permission**: Uses `expo-location` (`requestForegroundPermissionsAsync`) with explanation about map tracking
  2. **Notification permission**: Uses `expo-notifications` (`requestPermissionsAsync`) — only shown on Android 13+ (API 33), auto-skipped on older Android + all iOS (iOS permissions are requested on first use via `expo-location` plugin)
  - Each phase shows a "Skip" button so users aren't forced
  - If declined, shows amber banner + "Open Settings" fallback on the done screen
  - On mount, checks if permissions are already granted and auto-advances through the flow
- Previously permissions were requested lazily on first map mount (`PermissionGate` component), causing re-prompt confusion and broken foreground service states
- `expo-notifications` added to `app.json` plugins for proper Android notification channel setup

#### Map layers bottom sheet with toggle pills

- **`types/map.types.ts`**: `LayerKey` union type (`areaRatings | challenges | routes | records`), `ChallengeMarker`, `RouteRecord`, `RecordEntry` interfaces
- **`hooks/useMapLayers.ts`**: manages `activeLayers: Set<LayerKey>` state, `toggleLayer(layer)` and `setLayers` callbacks; default: `['areaRatings']`
- **`hooks/useChallengesData.ts`**: lazy data fetch gated by `enabled` boolean — only fetches mock data (3 Luanda challenges: Marginal Sprint, Ilha Trail, Maianga Loop) on first toggle-on; caches in component state, never re-fetches on subsequent toggles
- **`hooks/useRoutesData.ts`** / **`hooks/useRecordsData.ts`**: identical lazy pattern, returns empty arrays, marked with `// TODO: replace with real API call`
- **`components/ChallengesLayer.tsx`**: renders `Marker` for each challenge with `FlagTriangleRight` icon + challenge name label
- **`components/RoutesLayer.tsx`** / **`components/RecordsLayer.tsx`**: return `null`, wired to toggle state, `// TODO` comments for real data
- **`components/MapLayersBottomSheet.tsx`**: persistent bottom sheet with Reanimated slide-up + fade-in entrance (translateY + opacity). Contains horizontal `ScrollView` with 4 toggle pills:
  - _Area Ratings_ (no icon) | _Challenges_ (`FlagTriangleRight`) | _My Routes_ (`Route`) | _Records_ (`Trophy`)
  - Active: `colors.primary` bg + white text/icon; Inactive: `#F7F7F7` bg + `#AFAFAF` text/icon
  - Drag handle pill at top center, rounded top corners, shadow
- **MapScreen integration**: `useMapLayers` + lazy data hooks at top; layers rendered conditionally inside `<StrideMapView>`; bottom sheet rendered as absolute overlay; Start button repositioned at `bottom: 130` to stay above the sheet

### 10. Blank screen after deleting index.tsx (FIXED)

**Root cause**: Commit `1f5b4eb` deleted `src/app/index.tsx`. Expo Router requires a root index route — without it, no route matches and a blank screen is shown.

**Fix**: Recreated `src/app/index.tsx` with `<Redirect href='/(marketing)/splash' />`.

### 11. Email/password signup — "No sign up attempt was found" (FIXED)

**Root cause**: The `handleSignup` function in `signup.tsx` called `signUp.password()` (the new Core 3 API method), which sends `{ strategy: "password", emailAddress, password }` to the Clerk `/sign-ups` endpoint. This didn't properly create the sign-up attempt, so the subsequent `sendEmailCode()` call found no sign-up to verify.

**Fix**: Replaced `signUp.password()` with `signUp.create({ emailAddress, password })` — the standard approach used in Clerk docs, which properly creates the sign-up with email identifier + password before sending the verification email code.

**Note**: This email/password flow was never tested before (user always used OAuth). The `login.tsx` sign-in flow remains unchanged (it already works with `signIn.password()`).

### 12. MMKV error after clean build (STALE BUILD)

**Root cause**: `react-native-mmkv` was removed from the project (commit `dff9db7`) but the Android native build cache still links the old native module. The error "Failed to create a new MMKV instance: React Native is not running on-device." only appears in dev builds, not in production.

**Fix needed**: Clean rebuild (`cd android && ./gradlew clean && cd .. && pnpm android`) or `expo prebuild --clean && pnpm android`.

## To-do

- [ ] Test CARTO dark-matter style + user location dot on real device
- [ ] Add proper AreaOverlay type annotations (labels/legends for district names + ratings)
- [ ] Add OSRM route visualization on the map
- [x] Add challenges overlay layer on the map (ChallengesLayer + useChallengesData)
- [x] Add user run history / routes / records layer stubs
- [x] **Map markers toggle** — bottom sheet with toggle pills for each layer
- [x] Background location tracking for live runs
- [x] **Run control buttons** — add pause, stop, and lock buttons at the bottom of the map screen with their respective functionality
- [x] **Post-run reset** — after finishing a run, map returns to idle state: pitch goes back to 0, area overlays fade back in, run buttons are replaced by Start button
- [x] **Timer real-time fix** — `useRunTracking.ts` used `useMemo` with `Date.now()` but `Date.now()` is not reactive, so `elapsedTime` never recomputed between renders. Added `tick` state with `setInterval(1000)` during `running` state, added as dependency to trigger re-computation every second.
- [x] **PostRunBottomSheet StatCard styling** — removed dark `#1C1C1C` background, switched to border-only style (`borderWidth: 1.5, borderColor: '#E5E7EB'`) matching the ActionButton pattern. Text colors adjusted accordingly.
- [x] **Timer starts after countdown** — `handleStart()` now calls `startLocationUpdates()` (GPS only) BEFORE countdown; after countdown ends, `beginRun()` sets `store.state = 'running'` with `startedAt = Date.now()`. Split `startRun()` into `startLocationUpdates()` + `beginRun()` in `useRunTracking.ts`.
- [x] **Bottom sheet shows correct elapsed time** — added `finalElapsedTime` to `RunSession` store, computed in `stopRun()` when state transitions to `'finished'`. Hook now returns `store.finalElapsedTime` for finished state instead of `0`.
- [x] **Bottom sheet map zoom + pitch** — added `Camera` inside the mini-map with `bounds` computed from route coordinates, `pitch={60}`, and padding to zoom in tightly on the route instead of showing the whole world.
- [x] **TS error cleanup** — Fixed 10 TypeScript errors across 8 files:
  - Removed `Platform.Version >= 33` check in both `permissions.tsx` files (unnecessary API level guard)
  - Added `challengeId` to `useRunTracking` return type
  - Made location task callback `async` to match `Promise<any>` return type
  - Removed gesture props (`scrollEnabled`, `zoomEnabled`, etc.) from MapView (not in maplibre v11 MapProps)
  - Changed `Badge` variant from `'caption'` to `'body-sm'` (not in Variant type)
  - Removed `color` prop from `Toast` Text component and used `className` instead
  - Fixed `BottomSheetMethods` import (not exported from `@gorhom/bottom-sheet` v5)
  - Changed `logoEnabled`/`attributionEnabled` to `logo`/`attribution` on Map
  - Changed NearbyChallenges route from `'/(tabs)/challenges'` to `'/(tabs)/map'`
- [x] **Lock button worklet fix** — `RunControlButtons.tsx` used gesture callbacks (`onEnd`) that called `onToggleLock` directly on the UI thread. Reanimated worklets can't call JS functions without `runOnJS`. Wrapped both the LongPress and Tap handlers with `runOnJS(onToggleLock)()`.
- [x] **Back button hidden during run** — wrapped the back button (`ChevronLeft`) in `{isIdle && ...}` so it only shows when run state is `'idle'` (hidden during running, paused, and finished states).
- [x] **Button dock redesign** — grouped pause/resume, stop, and lock buttons into a single rounded pill-shaped `dock` container with semi-transparent dark background (`rgba(0,0,0,0.7)`). All buttons share consistent sizing (56x56, 28px radius). Thin dividers between them. Removed per-button background/border styling. Stop icon colored red (`#EF4444`).
- [x] **Area overlay tap popup FIX** — `handleMapPress` read `e.nativeEvent.lngLat.lng` but maplibre's `LngLat` is a tuple `[longitude, latitude]`, not `{lng, lat}`. Fixed with `Array.isArray(ll) ? ll[0] : ll.lng` to handle both formats. After fix, map tap now correctly identifies which Luanda district was tapped.
- [x] **Area overlay marker redesign** — replaced full-screen popup `AreaOverlayLabel` (card with breakdown pills + dismiss) with a maplibre `Marker` at the district centroid. Shows a 56×56 white circle with primary-colored filled star icon + rating number. Added `key={selectedArea.areaId}` in MapScreen to force React remount when tapping a different district (prevents maplibre's `"id" cannot be changed` error).
- [x] **Area overlay marker animation** — changed from `withSpring` (bouncy, user disliked) to subtle `withTiming` (250ms, scale 0.92→1 + opacity 0→1), softer and smoother entry.
- [ ] **Race counter overlay** — create a full-screen timer overlay (screenshot → Claude → prompt → implement)
- [x] **Migrate permissions to onboarding** — request location + notification permissions during `(setup)/` flow to match Duolingo-style UX (all permissions upfront)
- [ ] **Test foreground service on real Android device** — emulator may skip some notification behaviors

### 13. Challenges Tab Screen (DONE)

- Created `src/features/challenges/` feature folder with full structure:
  - **`types/challenges.types.ts`** — `Challenge`, `ChallengeParticipant`, `ChallengeFilter` (union: `'all' | 'nearby' | 'endingSoon' | 'mostPopular'`)
  - **`api/fetchChallenges.ts`** — typed API call via `apiClient` + 6 mock challenges (Luanda-localized: Samba Loop, Talatona, Miramar, Marginal, Ilha, Benfica)
  - **`hooks/useChallenges.ts`** — React Query hook with `placeholderData`, client-side filtering via `filterChallenges()` sorted by filter type, featured-first ordering
  - **`components/FilterChips.tsx`** — horizontally scrollable single-select chip row, active chip uses `colors.primary` bg, inactive uses `colors.surface` + border, consistent with MapLayersBottomSheet pill pattern
  - **`components/RouteSparkline.tsx`** — lightweight SVG sparkline via `react-native-svg` `Polyline`, normalizes `[lng, lat][]` coordinates to pixel space, memoized with `useMemo`
  - **`components/FeaturedChallengeCard.tsx`** — distinct layout for first item: FEATURED Badge, sparkline preview (280×64), title, creator handle, stats row (distance · time goal · runner count w/ Users icon), Accept button. Elevated shadow. `React.memo` wrapped.
  - **`components/ChallengeCard.tsx`** — standard card for subsequent items: sparkline thumbnail (56×56), title, stats line (distance · time · participants), distance-from-user label (conditional via `MapPin` icon + km), time-remaining countdown badge (pill, colored). `React.memo` wrapped.
  - **`components/ChallengeDetailSheet.tsx`** — `@gorhom/bottom-sheet` with `['60%', '85%']` snap points. Content: title, creator row (Avatar + handle), status Badge (`ACTIVE · X days left`), stats card (distance + time goal + 80×64 sparkline preview), leaderboard section (Crown/Medal icons, Avatar, handle, LEADER Badge for #1, time), expandable "+N more participants" row, Accept + View Route buttons
  - **`screens/ChallengesScreen.tsx`** — main screen with Header (title + subtitle), FilterChips, FlatList (optimized: `removeClippedSubviews`, `windowSize=5`, `maxToRenderPerBatch=10`), renders Featured card first then standard cards, memoized callbacks + renderItem, BottomSheet overlay
- Created `src/app/(tabs)/challenges.tsx` route file following the same pattern as `map.tsx`
- Tab icon: changed `Flag` → `LandPlot` in `(tabs)/_layout.tsx`
- Map layers: changed `FlagTriangleRight` → `LandPlot` in `ChallengesLayer.tsx` and `MapLayersBottomSheet.tsx`
- Empty state handled with `EmptyState` component (icon + message + CTA)
- Loading state handled with centered `Spinner`
- Data-driven ready: all types/interfaces in place for real API integration

### 14. MVVM Refactor — ViewModels for ChallengesScreen + MapScreen (DONE)

- Created `useChallengesViewModel` (`src/features/challenges/hooks/useChallengesViewModel.tsx`):
  - Owns `activeFilter` state, `selectedChallenge` state, `sheetRef`, all callbacks (`handleChallengePress`, `handleAccept`, `handleViewRoute`, `handleSheetClose`)
  - Returns `renderItem` + `keyExtractor` for FlatList (memoized, JSX-inclusive → `.tsx` extension)
  - Composes `useChallenges` data hook internally, exposes `isLoading`/`isEmpty`/`challenges`
- `ChallengesScreen.tsx` now purely presentational — destructures viewmodel, renders JSX only (dropped from 17 lines of state/logic to ~5)
- Created `useMapViewModel` (`src/features/map/hooks/useMapViewModel.tsx`):
  - Extracted all state: `countdownKey`, `overlayOpacity`, `selectedArea`, animation ref, map/postRun refs
  - Extracted all external hooks: `useRunTracking`, `useMapLayers`, `useChallengesData`, `useRoutesData`, `useRecordsData`, `useLocationStore`
  - Extracted all callbacks: `handleMapPress`, `handleStart`, `handleCountdownComplete`, `handlePauseResume`, `handleStop`, `handlePostRunClose`, `handleToggleLock`, `animateOverlayTo`
  - Extracted `useEffect` for camera tracking follow
  - Moved constants (`LUANDA_DISTRICTS`, `LUANDA_CENTER`, `DEFAULT_ZOOM`) + `polygonCentroid` helper alongside
  - `MapScreen.tsx` dropped from ~230 lines of state/logic to ~30 lines of pure rendering
- Fixed pre-existing bug: `EmptyState.tsx` referenced missing `not-found.png` asset — removed broken image require

### 15. History Screen (DONE)

- Created `src/features/history/` feature folder with full structure:
  - **`types/history.types.ts`** — `HistoryProfile`, `RunHistoryItem`, `HistoryChallengeFilter` (`'created' | 'participated'`), `HistoryChallenge`
  - **`api/fetchHistoryData.ts`** — typed API functions for profile, run history, and user challenges via `apiClient` + 3 mock data sets (profile with 47 runs/342km/12 won, 6 run entries with varying dates/areas, 5 user challenges split by created/participated)
  - **`hooks/useHistoryData.ts`** — 3 React Query hooks (`useProfile`, `useRunHistory`, `useHistoryChallenges`) with `placeholderData` and 5min stale time
  - **`hooks/useHistoryViewModel.tsx`** — MVVM hook owning filter state (`created`/`participated`), selected run for detail bottom sheet, sheet ref, memoized filtered challenges list, memoized `handleRunPress`/`handleSheetClose` callbacks, memoized `renderRunItem`/`renderChallengeItem` renderers
  - **`components/ProfileSummaryHeader.tsx`** — avatar (56px via `Avatar`), handle, stats row (Runs/km/Won themed stat blocks), theme token border
  - **`components/RunHistoryItemCard.tsx`** — pressable card with `RouteSparkline` thumbnail (56×56), date/area/stats row (`distance · time · pace`), `ChevronRight` indicator, `React.memo` wrapped
  - **`components/MiniChallengeCard.tsx`** — compact card for user challenges: title, meta row (participants icon+count, clock+time remaining), status `Badge` reusing `primary`/`secondary`/`danger` variants. `React.memo` wrapped.
  - **`components/RunDetailSheet.tsx`** — `@gorhom/bottom-sheet` with `['60%', '80%']` snap points. Content: title/date-area header, larger `RouteSparkline` (300×120), 2×2 stats grid (Distance, Time, Avg Pace, Elevation Gain — themed `StatCard` with surface+border), conditional challenge standing banner (`Trophy` icon + `primary` accent bg with placement text), full-width X+Close button
  - **`screens/HistoryScreen.tsx`** — purely presentational, calls `useHistoryViewModel` and destructures all state/handlers. `ScrollView` layout: `ProfileSummaryHeader` → "My Runs" section with `.map()` of `RunHistoryItemCard` → "My Challenges" section with inline filter chips (Created/Participated, same pill styling as `FilterChips`) + `.map()` of `MiniChallengeCard`. Empty state handled for both sections via `EmptyState` component. Loading state with centered `Spinner`.
- Created `src/app/(tabs)/history.tsx` route file following the same thin-route pattern as other tabs (imports `HistoryScreen`, delegates to it, no logic)
- Fixed `RecentRuns` "See all" navigation: `router.push('/(tabs)/home')` → `router.push('/(tabs)/history')`

### Next up

- [ ] Add tests for History screen (`HistoryScreen.test.tsx`)
- [ ] Test foreground service on real Android device
- [ ] Add OSRM route visualization on the map
