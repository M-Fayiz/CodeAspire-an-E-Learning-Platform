import ManagementLayout from "@/components/layout/ManagementLayout";
import { BookPlus } from "lucide-react";

import CourseCreateLayout from "@/features/mentor/course/courseCreation/courseForm";
// import CourseFormProvider from "@/context/courseForm.context";

const CourseCreation = () => {
  return (
    <>
      <ManagementLayout
        title="Create  Course "
        description=" Create your new Course Here"
        icon={<BookPlus className="h-10 w-10 text-gray-700" />}
      >
        <CourseCreateLayout />
      </ManagementLayout>
    </>
  );
};

export default CourseCreation;
