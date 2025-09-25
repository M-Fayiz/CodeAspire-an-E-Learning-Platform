import ManagementLayout from "@/components/layout/ManagementLayout";
import CourseCardSkeleton from "@/components/ui/cartSkelton";
import { useAuth } from "@/context/auth.context";
import EnrolledCourseCart from "@/features/courses_list/Enrolled Course/enrolledCart";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import type { IEnrolledListDto } from "@/types/DTOS/enrollements.dto";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CourseEnrolledList = () => {
  const { user } = useAuth();
  const [enrolledCourse, setEnrolledCourses] = useState<IEnrolledListDto[]>([]);
  useEffect(() => {
    (async () => {
      const data = await EnrolledService.getEnrolledCourse(user!.id);
      console.log("enrolled data ", data);
      if (data) {
        setEnrolledCourses(data);
      }
    })();
  }, []);
  return (
    <>
      <ManagementLayout
        description="Boost your progress"
        title="Enrolled Course"
      >
        {enrolledCourse && enrolledCourse.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourse.map((course, ind) => (
              <Link key={ind} to={`${course._id}`}>
                <EnrolledCourseCart key={ind} course={course} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((_, ind) => (
              <CourseCardSkeleton key={ind} />
            ))}
            <p>Please purchase a course and start your tech journey here</p>
          </div>
        )}
      </ManagementLayout>
    </>
  );
};

export default CourseEnrolledList;
