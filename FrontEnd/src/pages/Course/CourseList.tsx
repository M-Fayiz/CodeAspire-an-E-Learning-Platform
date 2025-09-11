import { Link, useLoaderData, useSearchParams } from "react-router";
import CourseCard from "../../features/courses_list/List/CourseCard";
import type { ICourseData, ICourseListDTO } from "@/types/courses.types";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SearchHeader from "../../features/courses_list/List/CourseSearchBar";
import FilterSidebar from "../../features/courses_list/List/CourseFilter";
import debounce from "lodash.debounce";
import useDebounce from "@/hooks/useDebounce";
import PaginationRounded from "@/components/ui/Pagination";

function CourseLayout() {
  const courses = useLoaderData() as ICourseData[];
  const [loading,setLoading]=useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage,setTotalPage]=useState(1)
  const searchQuery=useDebounce(searchParams.get('search'), 500)||''
  const currentPage=parseInt(searchParams.get('page') as string)||1
  const filterCategory=searchParams.get('category')||''
  const filterSubcategory=searchParams.get('subCategory')||''
  const filterLevel=searchParams.get('level')||''

    // useState(()=>{
    //   // setLoading(true)
    //   (async()=>{
    //     const query=new URLSearchParams(searchParams).toString()

    //   })
    // },[])
  

  

  




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
   console.log('this is the search params',searchParams.get('search'))
   console.log('this is the search +++',searchParams.getAll('category'))
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
