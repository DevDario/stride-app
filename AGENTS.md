# Stride App — Agent Guide

Expo SDK 55 + Expo Router v4 app for runners (Luanda, Angola).

## Quick start

```bash
pnpm install        # pnpm, not npm (hoisted linker)
pnpm start          # expo start
pnpm android        # expo run:android (native build)
pnpm ios            # expo run:ios
pnpm web            # expo start --web
```

## Verify

```bash
pnpm lint           # eslint src
pnpm format         # prettier --write "src/**/*.{js,jsx,ts,tsx}"
pnpm test           # jest (jest-expo + RNTL)
```

Run `lint -> test` in order. No typecheck script — rely on IDE/tsc.

Single test: `pnpm test -- src/features/home/__tests__/HomeScreen.test.tsx`

## Routing & auth

File-based routing in `src/app/`:

| Group          | Gating                           | Purpose                                       |
| -------------- | -------------------------------- | --------------------------------------------- |
| `(marketing)/` | Public                           | Splash, onboard, login, signup                |
| `(setup)/`     | Signed in, onboarding incomplete | know-you, frequency, schedule, level, welcome |
| `(tabs)/`      | Signed in, onboarding complete   | home, map, challenges, history, profile       |

Auth guard: `src/app/_layout.tsx` (ClerkProvider + AuthGuard). Onboarding gating in `(app)/_layout.tsx` and `(setup)/_layout.tsx`. Onboarding flag: Clerk `unsafeMetadata.onboardingComplete`.

Entry point: `expo-router/entry` (set in `package.json` `"main"`).

## Architecture

- **Feature-sliced**: `src/features/[name]/` with `screens/`, `hooks/`, `store/`, `__tests__/`
- **MVVM**: screens delegate logic to `use[Feature]ViewModel` hooks
- **Shared UI**: `src/components/` (Button, Text, Screen, Card, Avatar, Badge, Header, Modal, Spinner, Toast, TextInput, Select, EmptyState, ChallengeCard, RunHistoryCard)
- **Widgets**: `src/widgets/` for self-contained feature composites (e.g. WeeklyRunsResume, NearbyChallenges, RecentRuns)
- **State**: Zustand (`src/store/`), server state via TanStack React Query
- **API**: Axios (`src/services/api/client.ts`) — baseURL from `EXPO_PUBLIC_API_URL`, dev logging interceptors. Clerk handles auth token injection + refresh automatically.
- **Theme**: `src/theme/` — `tokens.ts` (light/dark colors, spacing, radii, typography) + `ThemeProvider.tsx` (React Context, follows system scheme)

## Path aliases

Configured in `tsconfig.json` + `babel.config.js` via `babel-plugin-module-resolver`:

`@components` `@screens` (→ `src/features/`) `@hooks` `@widgets` `@store` `@utils` `@api` `@assets` `@illustrations`

## Styling

- **NativeWind v4** (Tailwind via `className`) + **StyleSheet API** coexist
- **ThemeProvider** React Context for dynamic values
- **`cn()`** utility (`clsx` + `tailwind-merge`) in `src/utils/cn.ts`
- Fonts: `DaysOne_400Regular` (`font-title`), InstrumentSans variants (`font-sans`, `font-sans-md`, `font-sans-semi`, `font-sans-bold`)
- Custom `Text` component with `variant` prop (`title-xl`…`title-xs`, `body-lg`, `body`, `body-sm`, `label`, `button`)

## Map stack (react-native-maplibre)

Open-source: no Google Maps API required.

| Layer         | Library                            | Purpose                                   |
| ------------- | ---------------------------------- | ----------------------------------------- |
| Map renderer  | `@maplibre/maplibre-react-native`  | Renders tiles, markers, overlays          |
| Routes/search | OSRM (via HTTP or hosted instance) | Route calculation, geocoding              |
| GPS           | `expo-location`                    | Foreground + background location tracking |
| Animations    | `react-native-reanimated`          | Smooth UI during tracking, transitions    |

### Map architecture

- **`src/features/map/`** — screens, hooks, store for the map tab
- **`src/components/map/`** — reusable map elements (MapView wrapper, Markers, AreaOverlay, RouteLine, UserLocationDot, PermissionGate)
- **`src/services/map/`** — OSRM client, geocoding, route orchestration
- Every location-aware component wraps itself in a `PermissionGate` that requests `expo-location` foreground permission on first mount. Declined = show explanation + settings button (never silent fail).
- Map overlays (regions/area ratings, challenges, user records, route history) are separate component layers toggled by the parent screen.
- Smooth map transitions: animated region changes via Reanimated shared values + `MapView.animateToRegion()`, marker pulses, route draw animations.
- Defer to `react-native-maplibre` docs for native config (`app.json` plugin, Android/iOS manifest entries). Changes to `app.json` must be committed.

### Permission UX

1. On first map mount → prompt foreground location permission via `expo-location`
2. If denied → show `PermissionGate` component with explanation + "Open Settings" button (Linking.openSettings)
3. Only after foreground granted → offer background location opt-in for live tracking
4. Permission state persisted in Zustand (`useLocationStore`) to avoid re-prompting on tab switches

## Key dependencies

| Purpose    | Library                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Auth       | `@clerk/expo` + `expo-secure-store` (token cache: `"token-cache": "link:@clerk/clerk-expo/token-cache"`) |
| Navigation | `expo-router` v4, typed routes enabled                                                                   |
| State      | `zustand` + `@tanstack/react-query`                                                                      |
| Charts     | `react-native-gifted-charts`                                                                             |
| Animations | `react-native-reanimated` + `react-native-gesture-handler`                                               |
| Map        | `@maplibre/maplibre-react-native`, `expo-location`, OSRM (HTTP)                                          |

## Environment

- Node 22 (`.nvmrc`)
- pnpm (`.npmrc` with `approve-builds=true` for native deps)
- EAS project ID: `575739ba-94aa-48e9-bc6a-0251f70cde94`
- Scheme: `strideapp`, deep link: `strideapp://`, `https://strideapp.com`
- `.env` required: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `.env` for EAS builds: `API_URL`, `GOOGLE_MAPS_API_KEY` (unused with maplibre), `STORAGE_KEY`
- `.env*` files gitignored. `.cursor/`, `.cursorrules` also gitignored (use `.agents/` + `AGENTS.md`)

## EAS

```bash
pnpm eas:build:dev    # eas build --profile development --platform android
pnpm eas:update:dev   # eas update --profile development --environment development --branch development
```

Profiles: `development` (dev client), `preview` (internal), `production` (auto-increment).

## Testing quirks

- **No custom Jest config** — uses `jest-expo` preset defaults
- **No jest setup file**
- **MSW** is a devDependency but not configured
- **Maestro** E2E at `.maestro/home.yaml`

## Commit policy

Never commit, amend, push, or create PRs unless the user explicitly asks. Stage files only when told. Ask before any git write operation.

## Pre-commit

Husky v9. Running `pnpm lint-staged` on staged `*.{js,jsx,ts,tsx}` (eslint --fix + prettier --write) and `*.{json,css,md}` (prettier --write).

## Auth gotchas

- **CustomEvent polyfill** at top of `src/app/_layout.tsx` (before Clerk imports) — Hermes lacks `window`, Clerk needs it to initialize. Always keep it.
- **OAuth**: use `useSSO` hook + `WebBrowser.openAuthSessionAsync()`, never `signIn.sso()` (web-only popup API).
- **Finalize navigation**: `router.replace()` directly — never call `decorateUrl` (injects Safari ITP redirect, web-only).
- **Onboarding flag**: stored in `unsafeMetadata` (client-writable via `user.update()`). All guards check `unsafeMetadata.onboardingComplete`, NOT `publicMetadata`.

## Tab bar

Labels hidden (`tabBarShowLabel: false` in `(tabs)/_layout.tsx`). Icons only.

## Empty state UX

Every data-driven widget MUST handle the empty state — never show a blank screen.

- Check `data?.length` before rendering content
- lucide icon (`strokeWidth={1.5}`, `colors.textSecondary`), `title-sm` title, `body-sm` description (`text-neutral-400`), CTA button when applicable
- Charts: handle null/undefined data with fallback message
- Loading: React Query `placeholderData` for instant mock data; `isPending`/`isFetching` handled where UX matters

## Map component organization

```
src/
  components/
    map/
      MapView.tsx          # Wrapped maplibre MapView + Camera ref, forwardRef for flyTo
      MapMarker.tsx        # Reusable marker with animated pulse
      AreaOverlay.tsx      # Choropleth polygon overlay with color-coded rating (GeoJSON)
      RouteLine.tsx        # Animated route line (OSRM response rendered)
      UserLocationDot.tsx  # Blue dot + accuracy ring via MapMarker + expo-location (NOT maplibre UserLocation)
      PermissionGate.tsx   # Location permission request + fallback UI
  services/
    map/
      osrmClient.ts        # Axios instance for OSRM (route, geocode, search)
  features/
    map/
      screens/
        MapScreen.tsx      # Main map screen, orchestrates overlays
      hooks/
        useUserLocation.ts # expo-location hook with permission flow
        useMapRegion.ts    # Viewport state + animation
      store/
        locationStore.ts   # Zustand: permission state, last known location
      __tests__/
```

## Area overlays (choropleth) logic

AreaOverlay components render **freeform polygon overlays** (choropleth-style) on the map, NOT fixed administrative districts.

### Rendering rules

- An overlay is rendered at a **location + radius** when that area has collected **≥20 user feedbacks** on route conditions
- The overlay **starts gaining color** at **2–3 feedbacks** with low opacity
- Color becomes **more vivid/fully opaque** as feedback count approaches and exceeds 20
- Each overlay shows the **average rating** for that area (1–5 scale)

### Future: merging / adjacency

- When the app has 1000+ active users and dense feedback coverage, adjacent overlays can **merge** or sit **side by side**
- A green-rated area could directly border a red-rated area — the GeoJSON choropleth layer handles this natively via separate polygon features
- The rendering approach (separate `AreaOverlay` components per polygon, each with its own `GeoJSONSource` + `Layer`) already supports this: just add more polygons with their own rating/color

### District boundary data source

- Real Luanda commune boundaries (ADM3 level) from **geoBoundaries**: `https://www.geoboundaries.org/api/current/gbOpen/AGO/ADM3/`
- Direct GeoJSON: `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/AGO/ADM3/geoBoundaries-AGO-ADM3_simplified.geojson`
- 558 communes in Angola, ~10 in Luanda city (Ingombota, Samba, Maianga, Kilamba Kiaxi, Rangel, Sambizanga, Cazenga, Viana, Futungo de Belas, Kilamba)
- License: Creative Commons Attribution 3.0
