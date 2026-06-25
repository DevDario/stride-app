import { Header } from '@components/Header';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { Screen } from '../../../components/Screen';
import { Spinner } from '../../../components/Spinner';
import { ChallengeDetailSheet } from '../components/ChallengeDetailSheet';
import { FilterChips } from '../components/FilterChips';
import { useChallengesViewModel } from '../hooks/useChallengesViewModel';

export function ChallengesScreen() {
  const {
    challenges,
    activeFilter,
    setActiveFilter,
    selectedChallenge,
    sheetRef,
    handleAccept,
    handleViewRoute,
    handleSheetClose,
    renderItem,
    keyExtractor,
    isEmpty,
    isLoading,
  } = useChallengesViewModel();

  if (isLoading) {
    return (
      <Screen safeArea>
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea>
      <Header title='Challenges' rightElement={null} />

      <FilterChips activeFilter={activeFilter} onSelect={setActiveFilter} />

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            title='No challenges found'
            message='Try a different filter or check back later'
          />
        </View>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      <ChallengeDetailSheet
        ref={sheetRef}
        challenge={selectedChallenge}
        onClose={handleSheetClose}
        onAccept={handleAccept}
        onViewRoute={handleViewRoute}
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
  header: {
    paddingBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 24,
    paddingTop: 4,
  },
});
