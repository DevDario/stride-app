import { Header } from '@components/Header';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { Screen } from '../../../components/Screen';
import { Spinner } from '../../../components/Spinner';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { ProfileSummaryHeader } from '../components/ProfileSummaryHeader';
import { RunDetailSheet } from '../components/RunDetailSheet';
import { useHistoryViewModel } from '../hooks/useHistoryViewModel';
import type { HistoryChallengeFilter } from '../types/history.types';

const FILTER_OPTIONS: { key: HistoryChallengeFilter; label: string }[] = [
  { key: 'created', label: 'Created' },
  { key: 'participated', label: 'Participated' },
];

export function HistoryScreen() {
  const {
    profile,
    runs,
    challenges,
    activeFilter,
    setActiveFilter,
    selectedRun,
    sheetRef,
    handleSheetClose,
    renderRunItem,
    renderChallengeItem,
    isLoading,
  } = useHistoryViewModel();
  const { colors, radii, spacing } = useTheme();

  if (isLoading || !profile) {
    return (
      <Screen safeArea>
        <Header title='History' rightElement={null} />
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea>
      <Header title='History' rightElement={null} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileSummaryHeader profile={profile} />

        <Text
          variant='title-md'
          style={{
            color: colors.text,
            paddingHorizontal: spacing.md,
            marginVertical: 14,
          }}
        >
          My Runs
        </Text>

        {!runs || runs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              title='No runs yet'
              message='Complete your first run to see it here'
            />
          </View>
        ) : (
          runs.map((run) => renderRunItem(run))
        )}

        <Text
          variant='title-md'
          style={{
            color: colors.text,
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
            marginVertical: 14,
          }}
        >
          My Challenges
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.filterContainer,
            { paddingHorizontal: spacing.md, marginBottom: 12 },
          ]}
        >
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => setActiveFilter(option.key)}
                style={[
                  styles.chip,
                  {
                    borderRadius: radii.full,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    paddingHorizontal: spacing.md,
                    paddingVertical: 10,
                  },
                ]}
              >
                <Text
                  variant='label'
                  style={{
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {!challenges || challenges.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              title='No challenges'
              message={
                activeFilter === 'created'
                  ? "You haven't created any challenges yet"
                  : "You haven't joined any challenges yet"
              }
            />
          </View>
        ) : (
          challenges.map((c) => renderChallengeItem(c))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      <RunDetailSheet
        ref={sheetRef}
        run={selectedRun}
        onClose={handleSheetClose}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 40,
  },
});
