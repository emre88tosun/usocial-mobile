import { CometChatConversationsWithMessages } from '@cometchat/chat-uikit-react-native';
import * as React from 'react';

import { FocusAwareStatusBar } from '@/components/ui';

export default function Chats() {
  return (
    <>
      <FocusAwareStatusBar />
      <CometChatConversationsWithMessages />
    </>
  );
}
