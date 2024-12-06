import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = { amount: number };
type Response = { clientSecret: string };

export const useCreateIntent = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/create-intent',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
