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

## To-do

- [ ] Test CARTO dark-matter style + user location dot on real device
- [ ] Add proper AreaOverlay type annotations (labels/legends for district names + ratings)
- [ ] Add OSRM route visualization on the map
- [x] Add challenges overlay layer on the map (ChallengesLayer + useChallengesData)
- [x] Add user run history / routes / records layer stubs
- [x] **Map markers toggle** — bottom sheet with toggle pills for each layer
- [ ] Background location tracking for live runs
- [ ] **Race counter overlay** — create a full-screen timer overlay (screenshot → Claude → prompt → implement)
- [ ] **Run control buttons** — add pause, stop, and lock buttons at the bottom of the map screen with their respective functionality
- [ ] **Post-run reset** — after finishing a run, map returns to idle state: pitch goes back to 0, area overlays fade back in, run buttons are replaced by Start button
