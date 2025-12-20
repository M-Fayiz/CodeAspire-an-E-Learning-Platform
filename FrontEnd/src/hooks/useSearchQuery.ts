import { useSearchParams } from "react-router-dom";

export function useSearchPagination(defaults = { page: 1, limit: 10 }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || defaults.page;
 

  const setSearch = (value: string) => {
    setSearchParams({
      search: value,
      page: "1", 
      
    });
  };

  const setPage = (value: number) => {
    setSearchParams({
      search,
      page: value.toString(),
      
    });
  };

  return {
    search,
    page,
    setSearch,
    setPage,
  };
}
