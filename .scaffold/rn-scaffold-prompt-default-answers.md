Project Identity: stride-app, com.devdario.strideapp, expo dev, Android SDK 26; Architecture: FSD, strict separation, domain decoupled; Navigation: expo-router v4, Stack/Tabs/Drawer, splash/onboarding, deep linking

State: Zustand, TanStack Query, axios client with Auth/Refresh/Logging/Error. Styling: NativeWind, design tokens, light/dark theme w/ system detection

ESLint: eslint-config-universe, import, unused, hooks, a11y, ts; Prettier: 100, 3, single, no commas, no bracket; Husky: yes

TS: yes strict, aliases yes (@components, @screens, @hooks, @store, @utils, @api)

Testing: Jest+jest-expo, RTL, MSW, Maestro; Coverage: no; Examples: yes

Components: Button, Text, TextInput, Screen, Card, Avatar, Badge, Modal(bottom sheet), Spinner, Toast(snackbar), EmptyState(with mascot). Compound components: yes; Storybook: no

CI: no; EAS: yes; Extras: mmkv, gesture handler, i18n

Auth: implement Clerk for auth