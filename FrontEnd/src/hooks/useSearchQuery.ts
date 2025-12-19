import { useState } from "react";
import useDebounce from "./useDebounce";

export const useSearchQuery = (initialLimit = 5) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const debouncedSearch = useDebounce(search, 500);

  return {
    query: {
      search: debouncedSearch,
      page,
      limit,
      filters,
    },
    actions: {
      setSearch,
      setPage,
      setFilters,
      resetPage: () => setPage(1),
    },
  };
};
