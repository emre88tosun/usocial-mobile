import type { AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { client } from '../common/client';
import type { Influencer, PaginateQuery } from '../types';

type Response = PaginateQuery<Influencer & { chat_unlocked: boolean }>;
type Variables = {};

export const useInfiniteInfluencers = createInfiniteQuery<
  Response,
  Variables,
  AxiosError
>({
  queryKey: ['influencers'],
  fetcher: (_variables: any, { pageParam }): Promise<Response> => {
    return client({
      url: `/influencers?per_page=3&page=${pageParam}`,
      method: 'GET',
    }).then((response) => response.data);
  },
  getNextPageParam: (page) => {
    if (page.last_page > page.current_page) {
      return page.current_page + 1;
    }
    return null;
  },
  initialPageParam: 1,
  staleTime: 1000 * 60 * 30,
});
