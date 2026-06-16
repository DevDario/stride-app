# Stride App — Agent Guide

Expo SDK 55 + Expo Router v4 app for runners (Luanda, Angola).

## Quick start

```bash
pnpm install        # pnpm, not npm (hoisted linker, workspace)
pnpm start          # expo start
pnpm android        # expo run:android (native build)
pnpm ios            # expo run:ios
pnpm web            # expo start --web
```

## Verify commands

```bash
pnpm lint           # eslint src
pnpm format         # prettier --write "src/**/*.{js,jsx,ts,tsx}"
pnpm test           # jest (jest-expo + RNTL + MSW)
```

Run in order: `lint -> test` (no typecheck script exists; rely on IDE/tsc).

Single test: `pnpm test -- src/features/home/__tests__/HomeScreen.test.tsx`

## Routing & auth

File-based routing in `src/app/` with route groups:

| Group | Gating | Purpose |
|---|---|---|
| `(marketing)/` | Public | Splash, onboard-1..4, login, signup |
| `(setup)/` | Signed in, onboarding incomplete | know-you, frequency, schedule, level, welcome |
| `(app)/` | Signed in + onboarding complete | Wraps `(tabs)` |
| `(tabs)/` | Signed in + onboarding complete | home, map, challenges, history, profile |

Auth guard logic lives in `src/app/_layout.tsx` (ClerkProvider + AuthGuard). Onboarding gating in `(app)/_layout.tsx` and `(setup)/_layout.tsx`. Entry point is `expo-router/entry` (set in `package.json` `"main"`).

## Architecture

- **Feature-sliced**: `src/features/[name]/` with `screens/`, `hooks/`, `store/`, `__tests__/`
- **MVVM pattern**: screens delegate logic to `use[Feature]ViewModel` hooks
- **Shared UI**: `src/components/` (Button, Text, Screen, Card, Avatar, Badge, Header, Modal, Spinner, Toast, TextInput, Select, EmptyState)
- **Widgets**: `src/widgets/` for self-contained feature composites (e.g. WeeklyRunsResume)
- **Global state**: Zustand in `src/store/`; server state via TanStack React Query
- **API client**: Axios with interceptor for token injection + refresh (`src/services/api/client.ts`)
- **Theme**: `src/theme/` — `tokens.ts` (light/dark colors, spacing, radii, typography) + `ThemeProvider.tsx` (React Context, follows system color scheme)

## Path aliases

Configured in `tsconfig.json` and wired in `babel.config.js` via `babel-plugin-module-resolver`. TypeScript and Metro both resolve them.

Alias reference:
- `@components/*` → `src/components/*`
- `@screens/*` → `src/features/*`
- `@hooks/*` → `src/hooks/*`
- `@widgets/*` → `src/widgets/*`
- `@store/*` → `src/store/*`
- `@utils/*` → `src/utils/*`
- `@api/*` → `src/services/api/*`

## Styling

Hybrid approach active simultaneously:
- **NativeWind v4** (Tailwind utility classes via `className`)
- **StyleSheet API** (some components use both for the same element)
- **ThemeProvider** React Context for dynamic values (colors, spacing)
- **`cn()`** utility (`clsx` + `tailwind-merge`) in `src/utils/cn.ts`
- Custom fonts: `DaysOne_400Regular` (`font-title`), InstrumentSans variants (`font-sans`, `font-sans-md`, `font-sans-semi`, `font-sans-bold`)
- Custom `Text` component with `variant` prop (`title-xl`, `title-lg`, `title-md`, `title-sm`, `body-lg`, `body`, `body-sm`, `label`, `button`)

## Key dependencies

| Purpose | Library |
|---|---|
| Auth | `@clerk/expo` + `expo-secure-store` (token cache linked via `"token-cache": "link:@clerk/clerk-expo/token-cache"`) |
| Navigation | `expo-router` v4, typed routes enabled |
| Maps | Not yet integrated (exp-location in deps) |
| State | `zustand` + `@tanstack/react-query` |
| Charts | `react-native-gifted-charts` |
| Local storage | `react-native-mmkv` |
| Animations | `react-native-reanimated` + `react-native-gesture-handler` |

## Environment

- Node 22 (`.nvmrc`)
- pnpm (`.npmrc` with `approve-builds=true` for native deps)
- EAS project ID: `575739ba-94aa-48e9-bc6a-0251f70cde94`
- App scheme: `strideapp`, deep link prefix: `strideapp://`, `https://strideapp.com`
- EAS env vars required: `API_URL`, `GOOGLE_MAPS_API_KEY`, `STORAGE_KEY`
- Clerk key via `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `.env*` files gitignored
- `.cursor/` and `.cursorrules` gitignored (this repo uses `.agents/` + `AGENTS.md`)

## EAS builds

```bash
pnpm eas:build:dev    # eas build --profile development --platform android
pnpm eas:update:dev   # eas update --profile development --environment development --branch development
```

Three build profiles: `development` (dev client, internal), `preview` (internal), `production` (auto-increment).

## Testing quirks

- **Jest config**: no custom `jest.config.js` — uses defaults from `jest-expo` preset
- **No jest setup file** exists
- **MSW** is a devDependency but not configured yet
- **Maestro** E2E test at `.maestro/home.yaml` (basic: clear state + tap "Reload User")

## Known issues

- API client falls back to hardcoded `https://api.strideapp.com` when `EXPO_PUBLIC_API_URL` is not set — set it in local `.env` and EAS env
- Husky v8 uses `husky install` command (configured as `"prepare": "husky install"` in scripts)
