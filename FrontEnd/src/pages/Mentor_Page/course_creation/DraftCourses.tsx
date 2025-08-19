import ManagementLayout from "@/components/layout/ManagementLayout";

import { ReusableTable } from "@/components/shared/Table";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth.context";
import courseService from "@/service/client-API/mentor/course.service";
import type { CourseForm } from "@/types/courses.types";
import { useCourseFormContext } from "@/context/courseForm.context";
import { useNavigate } from "react-router";

function DraftCourses() {
  const [course, setCourses] = useState<CourseForm[] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseForm>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setFormData, setCourseId } = useCourseFormContext();
  useEffect(() => {
    async function fetchDraftedCourse() {
      const data = await courseService.getMentorDraftedCourse(user!.id);
      if (data) {
        setCourses(data);
      }
    }
    fetchDraftedCourse();
  }, []);
  const handleEditORremoveID = async (data: CourseForm) => {
    setSelectedCourse(data);
    setCourseId(data._id as string);
    setFormData({ ...data });
    navigate("/mentor/courses/create");
  };

  return (
    <div>
      <ManagementLayout
        title="Drafted Course List"
        description="Manage your draft and in-progress courses"
      >
        {course && course.length > 0 && (
          <ReusableTable
            data={course}
            columns={[
              { key: "title", header: "Course Title" },
              { key: "language", header: "Language" },
              { key: "price", header: "Price", render: (value) => `$${value}` },
            ]}
            actions={[{ label: "edit", onClick: handleEditORremoveID }]}
          />
        )}
      </ManagementLayout>
    </div>
  );
}

export default DraftCourses;
