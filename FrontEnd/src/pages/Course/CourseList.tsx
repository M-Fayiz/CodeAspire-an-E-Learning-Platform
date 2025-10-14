import { Link, useSearchParams } from "react-router";
import CourseCard from "../../features/courses_list/List/CourseCard";
import type { ICourseData, ISearchQuery } from "@/types/DTOS/courses.types";
import { useEffect, useState } from "react";

import SearchHeader from "../../features/courses_list/List/CourseSearchBar";
import FilterSidebar from "../../features/courses_list/List/CourseFilter";
import useDebounce from "@/hooks/useDebounce";
import PaginationRounded from "@/components/ui/Pagination";
import courseService from "@/service/mentor/course.service";
import CourseCardSkeleton from "@/components/ui/cartSkelton";
import { useAuth } from "@/context/auth.context";
import Header from "@/components/layout/landing/header";

function CourseLayout() {
  const [courses, setCourses] = useState<ICourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);
  const searchQuery = useDebounce(searchParams.get("search"), 500) || "";
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const filterCategory = searchParams.get("category") || "";
  const filterSubcategory = searchParams.get("subCategory") || "";
  const filterLevel = searchParams.get("level") || "";
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const query: ISearchQuery = {
        search: searchQuery.trim(),
        category: filterCategory,
        subcategory: filterSubcategory,
        level: filterLevel,
        page: currentPage,
        limit: searchParams.get("limit")
          ? Number(searchParams.get("limit"))
          : 5,
      };
   

      const data = await courseService.fetchCourses(query, user?.id);
      if (data) {
        setCourses(data.updated as ICourseData[]);
        setTotalPage(data.totalDocument);
        setLoading(false);
      }
    })();
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchParams((prv) => {
      prv.set("search", query);
      prv.set("page", "1");
      return prv;
    });
  };

  const handleCategory = (category: string[]) => {
    setSearchParams((prv) => {
      prv.delete("category");
      category.forEach((cat) => {
        prv.append("category", cat);
      });
      prv.set("page", "1");
      return prv;
    });
  };
  const handleSubCategory = (subCat: string[]) => {
    setSearchParams((prv) => {
      prv.delete("subcategory");
      subCat.forEach((subcat) => {
        prv.append("subcategory", subcat);
      });
      prv.set("page", "1");
      return prv;
    });
  };
  const handleLevel = (levels: string[]) => {
    setSearchParams((prv) => {
      prv.delete("level");
      levels.forEach((level) => {
        prv.append("level", level);
      });
      prv.set("page", "1");
      return prv;
    });
  };

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(value));
      return prev;
    });
  };

  return (
    <>
      <Header />
      <div className="relative top-18 min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SearchHeader
            placeholder="search Courses ...."
            handleSearch={handleSearch}
          />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterSidebar
                handleCategory={handleCategory}
                handleLevel={handleLevel}
                handleSubCategory={handleSubCategory}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {loading &&
                  [1, 3, 4, 5, 6].map((_, ind) => (
                    <CourseCardSkeleton key={ind} />
                  ))}
                {courses.map((course, ind) => (
                  <Link key={ind} to={`${course._id}`}>
                    <CourseCard course={course} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {courses.length > 0 && (
            <div className="flex justify-center">
              <PaginationRounded
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={handlePage}
              />
              e
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CourseLayout;
