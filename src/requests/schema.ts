export type PageInfo = {
  totalCount: number;
  page: number;
  limit: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export type ListResponse<T> = {
  data: T[];
  pageInfo: PageInfo;
};
