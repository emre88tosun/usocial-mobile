import { FlashList } from '@shopify/flash-list';
import React from 'react';

import type { Influencer } from '@/api';
import { useInfiniteInfluencers } from '@/api/influencers';
import { Card } from '@/components/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Discover() {
  const {
    data: influencers,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    isPending,
    isError,
  } = useInfiniteInfluencers();
  const renderItem = React.useCallback(
    ({ item }: { item: Influencer & { chat_unlocked: boolean } }) => (
      <Card {...item} />
    ),
    [],
  );
  const data = React.useMemo(() => {
    if (!influencers || !influencers?.pages)
      return [] as (Influencer & { chat_unlocked: boolean })[];
    return influencers.pages.reduce(
      (prev, next) => {
        return [...prev, ...next.data];
      },
      [] as (Influencer & { chat_unlocked: boolean })[],
    );
  }, [influencers]);

  if (isError) {
    return (
      <View>
        <Text> Error Loading data </Text>
      </View>
    );
  }
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isFetching) {
            fetchNextPage();
          }
        }}
      />
    </View>
  );
}
