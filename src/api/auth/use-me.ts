import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { User } from '../types';

type Response = User;
type Variables = void;

export const useMe = createQuery<Response, Variables, AxiosError>({
  queryKey: ['me'],
  fetcher: () => {
    return client.get(`/auth/me`).then((response) => response.data);
  },
  staleTime: 1000 * 60 * 10,
});
