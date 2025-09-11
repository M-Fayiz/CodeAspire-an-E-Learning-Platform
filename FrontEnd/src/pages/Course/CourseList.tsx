import { Link, useLoaderData, useSearchParams } from "react-router";
import CourseCard from "../../features/courses_list/List/CourseCard";
import type { ICourseData, ICourseListDTO, ISearchQuery } from "@/types/courses.types";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SearchHeader from "../../features/courses_list/List/CourseSearchBar";
import FilterSidebar from "../../features/courses_list/List/CourseFilter";
import debounce from "lodash.debounce";
import useDebounce from "@/hooks/useDebounce";
import PaginationRounded from "@/components/ui/Pagination";
import courseService from "@/service/client-API/mentor/course.service";

function CourseLayout() {
  const [courses,setCourses]=useState <ICourseData[]>([])
  const [loading,setLoading]=useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage,setTotalPage]=useState(1)
  const searchQuery=useDebounce(searchParams.get('search'), 500)||''
  const currentPage=searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const filterCategory=searchParams.get('category')||''
  const filterSubcategory=searchParams.get('subCategory')||''
  const filterLevel=searchParams.get('level')||''

    useEffect(() => {
      (async()=>{
        const query: ISearchQuery = {
      search:searchQuery,
      category: filterCategory,
      subcategory:filterSubcategory,
      level: filterLevel,
      page: currentPage,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 1,
    };
        const data= await courseService.fetchCourses(query)
        if(data){
          setCourses(data.updated as ICourseData[])
          setTotalPage(data.totalDocument)
        }
      })()
    }, [searchParams]);
  

    const handleSearch=(query:string)=>{
      setSearchParams(prv=>{
        prv.set('search',query)
        prv.set('page','1')
        return prv
      })
    }
  
    const handleCategory=(category:string[])=>{
      setSearchParams(prv=>{
        prv.delete('category')
        category.forEach(cat=>{
          prv.append('category',cat)
        })
        prv.set('page','1')
        return prv
      })
    }
    const handleSubCategory=(subCat:string[])=>{
      setSearchParams(prv=>{
        prv.delete('subcategory')
        subCat.forEach(subcat=>{
          prv.append('subcategory',subcat)
        })
        prv.set('page','1')
        return prv
      })
    }
     const handleLevel=(levels:string[])=>{
      setSearchParams(prv=>{
        prv.delete('level')
        levels.forEach(level=>{
          prv.append('level',level)
        })
        prv.set('page','1')
        return prv
      })
     }

     const handlePage=(event: React.ChangeEvent<unknown>, value:number)=>{
      setSearchParams(prev => {
              prev.set('page', String(value));
              return prev;
          });
     }
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SearchHeader placeholder="search Courses ...." handleSearch={handleSearch}/>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><FilterSidebar handleCategory={handleCategory} handleLevel={handleLevel} handleSubCategory={handleSubCategory}/></div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CourseLayout;
