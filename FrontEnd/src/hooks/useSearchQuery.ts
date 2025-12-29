import { useSearchParams } from "react-router-dom";

export function useSearchPagination(defaults = { page: 1, limit: 10 }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || defaults.page;
  const filter = searchParams.get(`filter`) || "";

  const setSearch = (value: string) => {
    setSearchParams({
      search: value,
      page: "1",
      filter: filter,
    });
  };

  const setPage = (value: number) => {
    setSearchParams({
      search,
      page: value.toString(),
      filter,
    });
  };
  const setFilter = (value: string) => {
    setSearchParams({
      search,
      page: "1",
      filter: value,
    });
  };
  return {
    search,
    page,
    filter,
    setSearch,
    setPage,
    setFilter,
  };
}
