import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = { influencer_id: number };
type Response = { message: string };

export const useUnlockInfluencer = createMutation<
  Response,
  Variables,
  AxiosError<{ message?: string }>
>({
  mutationFn: async (variables) =>
    client({
      url: '/chat/unlock',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
