import { useLoaderData, useSearchParams } from "react-router";
import CourseCard from "./CourseCard";
import type { ICourseListDTO } from "@/types/courses.types";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import SearchHeader from "./CourseSearchBar";
import FilterSidebar from "./CourseFilter";
import debounce from "lodash.debounce";
import useDebounce from "@/hooks/useDebounce";

function CourseLayout() {
  const courses = useLoaderData() as ICourseListDTO[];
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categories: searchParams.getAll("categories"),
    level: searchParams.getAll("levels"),
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });

  const debounced = useDebounce(filters.search, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    filters.categories.forEach((cat) => params.append("categories", cat));
    filters.level.forEach((l) => params.append("level", l));
    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));
  }, [filters, setSearchParams]);

  const toggleFilter = (key: "categories" | "level", value: string) => {
    setFilters((prev) => {
      const values = new Set(prev[key]);
      if (values.has(value)) {
        values.delete(value);
      } else {
        values.add(value);
      }
      return { ...prev, [key]: Array.from(values), page: 1 };
    });
  };

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SearchHeader />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterSidebar />
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseLayout;
