import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
type Response = { message: string };

export const useRegister = createMutation<
  Response,
  Variables,
  AxiosError<{ message?: string }>
>({
  mutationFn: async (variables) =>
    client({
      url: '/auth/register',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
