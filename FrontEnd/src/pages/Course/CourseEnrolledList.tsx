import ManagementLayout from "@/components/layout/ManagementLayout"
import { useAuth } from "@/context/auth.context"
import EnrolledCourseCart from "@/features/courses_list/Enrolled Course/enrolledCart"
import { EnrolledService } from "@/service/client-API/Learner/enrolledCourse.service"
import type { IEnrolledListDto } from "@/types/DTOS/enrollements.dto"
import { useEffect, useState } from "react"



const CourseEnrolledList=()=>{
    const {user}=useAuth()
    const [enrolledCourse,setEnrolledCourses]=useState<IEnrolledListDto[]>([])
    useEffect(()=>{
        (async()=>{
            const data=await EnrolledService.getEnrolledCourse(user!.id)
            if(data){
                setEnrolledCourses(data)
            }
        })()
    },[])
    return(
        <>
        <ManagementLayout description="Boost your progress" title="Enrolled Course">
  {enrolledCourse && enrolledCourse.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrolledCourse.map((course) => (
        <EnrolledCourseCart key={course._id} course={course} />
      ))}
    </div>
  ) : (
    <div>
      <p>Please purchase a course and start your tech journey here</p>
    </div>
  )}

  <p>hello</p>
</ManagementLayout>

        </>
    )
}

export default CourseEnrolledList