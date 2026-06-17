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
- Created `src/components/map/StrideMapView.tsx` — maplibre `Map` wrapper with default Luanda center/zoom
- Created `src/components/map/MapMarker.tsx` — animated marker with Reanimated scale pulse
- Created `src/components/map/UserLocationDot.tsx` — custom blue dot with animated accuracy pulse via `UserLocation`
- Created `src/components/map/AreaOverlay.tsx` — GeoJSON region overlay with color-coded fill/outline (rating 1-5)
- Created `src/components/map/RouteLine.tsx` — route line from OSRM GeoJSON coordinates
- Created `src/features/map/hooks/useUserLocation.ts` — permission + GPS tracking hook
- Created `src/features/map/hooks/useMapRegion.ts` — viewport state management
- Created `src/features/map/screens/MapScreen.tsx` — orchestrates map with demo Luanda district overlays + back button + recenter button
- Created `src/app/(tabs)/map.tsx` — route file rendering `MapScreen`
- Tab labels hidden (`tabBarShowLabel: false`)

## To-do

- [ ] Build native app (`pnpm android`) to link `expo-location` + maplibre native modules
- [ ] Verify map renders with OSM tiles on device/emulator
- [ ] Add real OSRM route visualization on the map
- [ ] Add challenges overlay layer on the map
- [ ] Add user run history visualization on the map
- [ ] Background location tracking for live runs
