export interface SearchQuery {
  search: string;
  page: number;
  limit: number;
  filters?: Record<string, string>;
}
