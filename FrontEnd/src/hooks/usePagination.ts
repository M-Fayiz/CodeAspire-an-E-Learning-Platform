import { useEffect, useState } from "react";

export const usePaginatedFetch = <T>(
  fetchFn: (query: any) => Promise<{ data: T[]; totalPages: number }>,
  query: any,
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      const res = await fetchFn(query);
      if (!ignore) {
        setData(res.data);
        setTotalPages(res.totalPages);
        setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [query]);

  return { data, loading, totalPages };
};
