import * as React from 'react';

import { Buttons } from '@/components/buttons';
import { Colors } from '@/components/colors';
import { Inputs } from '@/components/inputs';
import { Typography } from '@/components/typography';
import { FocusAwareStatusBar, ScrollView, View } from '@/components/ui';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <View className="flex-1">
          <Typography />
          <Colors />
          <Buttons />
          <Inputs />
        </View>
      </ScrollView>
    </>
  );
}
