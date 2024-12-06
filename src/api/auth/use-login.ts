import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = { email: string; password: string };
type Response = { token: string; refresh_token: string; chat_token: string };

export const useLogin = createMutation<
  Response,
  Variables,
  AxiosError<{ message?: string }>
>({
  mutationFn: async (variables) =>
    client({
      url: '/auth/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
