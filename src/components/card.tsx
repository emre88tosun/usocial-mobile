import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { type Influencer, useMe } from '@/api';
import { useUnlockInfluencer } from '@/api/influencers';
import {
  Button,
  Image,
  showErrorMessage,
  showSuccessMessage,
  Text,
  View,
} from '@/components/ui';

type Props = Influencer & { chat_unlocked: boolean };

const images = [
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515386474292-47555758ef2e?auto=format&fit=crop&w=800&q=80',
  'https://plus.unsplash.com/premium_photo-1666815503002-5f07a44ac8fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
];

export const Card = ({
  user,
  bio,
  id,
  chat_unlocked,
  gem_cost_per_dm,
}: Props) => {
  const { data } = useMe();
  const { mutate: unlock, isPending } = useUnlockInfluencer();
  const queryClient = useQueryClient();
  const invalidateInfluencers = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: ['influencers'] })
      .catch(() => {});
    queryClient.invalidateQueries({ queryKey: ['me'] }).catch(() => {});
  }, []);
  const onUnlock = () => {
    unlock(
      {
        influencer_id: id,
      },
      {
        onError: (err) => {
          showErrorMessage(err.response?.data?.message ?? err.message);
        },
        onSuccess: () => {
          showSuccessMessage('Chat unlocked');
          invalidateInfluencers();
        },
      },
    );
  };
  return (
    <View
      key={id}
      className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900"
    >
      <Image
        className="h-56 w-full overflow-hidden rounded-t-xl"
        contentFit="cover"
        source={{
          uri: images[Math.floor(Math.random() * images.length)],
        }}
      />

      <View className="p-2">
        <Text className="text-lg font-bold ">{user?.name}</Text>
        <Text numberOfLines={3} className="leading-snug text-gray-600">
          {bio}
        </Text>
        {!chat_unlocked && String(data?.role?.name) === 'standard user' && (
          <Button
            onPress={onUnlock}
            loading={isPending}
            label={`DM Me (${gem_cost_per_dm} Gems)`}
            variant="secondary"
          />
        )}
      </View>
    </View>
  );
};
