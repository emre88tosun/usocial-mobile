export type PaginateQuery<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from?: number;
  last_page: number;
  last_page_url: string;
  next_page_url?: string;
  path: string;
  per_page: number;
  prev_page_url?: string;
  to?: number;
  total: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  gem_data?: {
    id: number;
    amount?: number;
  };
};

export type Influencer = {
  id: number;
  user_id: number;
  user?: User;
  bio: string;
  gem_cost_per_dm: number;
};
