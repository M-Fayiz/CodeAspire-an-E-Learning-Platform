// DraftCourses.tsx
import ManagementLayout from "@/components/layout/ManagementLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth.context";
import courseService from "@/service/client-API/mentor/course.service";
import type { IFormCourseDTO } from "@/types/courses.types";
import { useCourseFormContext } from "@/context/courseForm.context";
import { Link, useNavigate } from "react-router";
import MyCourseCard from "@/features/mentor/course-form/MentorCours";
import { CourseFormDTO } from "@/types/DTOS/CourseFormDto";
import { Spinner } from "@/components/templates/Spinner";

import { PlusCircle } from "lucide-react";

function MYCourses() {
  const [courses, setCourses] = useState<IFormCourseDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setFormData, setCourseId } = useCourseFormContext();

  useEffect(() => {
    async function fetchDraftedCourse() {
      setLoading(true);
      const data = await courseService.getMentorCourse(user!.id);
      setCourses(data || []);
      setLoading(false);
    }
    fetchDraftedCourse();
  }, [user]);

  const handleEditCourse = (data: IFormCourseDTO) => {
    setCourseId(data._id as string);
    const mappedCourse = CourseFormDTO(data);
    setFormData({ ...mappedCourse });
    navigate("/mentor/courses/create");
  };

  return (
    <ManagementLayout
      title="My Course List"
      description="Manage your courses"
    >
      <div className="flex  p-6">
      <Link to={'/mentor/courses/create'}
        className="flex bg-blue-500 gap-2 px-6 py-3 p-4 rounded-2xl shadow-md text-white transition-transform hover:scale-105"
      >
        <PlusCircle className="w-5 h-5" />
        Create Course
      </Link>
    </div>
      {loading ? (
        <Spinner fullScreen variant="theme"/>
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <MyCourseCard
              course={course}
              key={course._id}
              onEdit={() => handleEditCourse(course)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No drafted courses found. Start creating one!
        </p>
      )}
    </ManagementLayout>
  );
}

export default MYCourses;
