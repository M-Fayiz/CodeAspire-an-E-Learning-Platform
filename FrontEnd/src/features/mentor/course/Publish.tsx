import { Button } from "@/components/ui/button";
import { useCourseFormContext } from "@/context/courseForm.context";
import courseService from "@/service/mentor/course.service";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Publish() {
  const { courseId, setFormData, resetForm } = useCourseFormContext();
  const navigate = useNavigate();
  const onPublish = async () => {
    try {
      const status = await courseService.publishCourse(courseId);
      if (status) {
        toast.success("Your Course Successfully Published");
        setFormData((prev) => ({ ...prev, status: status }));
        resetForm();
        navigate("/mentor/courses/my-courses");
      }
    } catch (error) {}
  };
  return (
    <div className="flex items-center justify-center gap-4 p-6">
      <Button
        className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-md bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-transform"
        onClick={onPublish}
      >
        <Send className="w-5 h-5" />
        Publish Course
      </Button>
    </div>
  );
}
