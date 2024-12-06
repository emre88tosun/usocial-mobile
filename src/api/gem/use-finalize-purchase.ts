import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = { paymentId: string; amount: number };
type Response = { message: string };

export const useFinalizePurchase = createMutation<
  Response,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/finalize-purchase',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
