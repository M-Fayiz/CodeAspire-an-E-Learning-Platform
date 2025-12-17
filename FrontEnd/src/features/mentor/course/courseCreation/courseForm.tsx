import { useState } from "react";
import { ClipboardPen, Layers, CloudUpload } from "lucide-react";
import Taps from "@/components/common/Taps";
import { useCourseFormContext } from "@/context/courseForm.context";
import { toast } from "sonner";

import CourseCurriculum from "./CourseCurriculum";
import BasicCourseInformation from "./BasicIformation";
import Publish from "../Publish";

export default function CourseCreateLayout() {
  const [activeTab, setActiveTab] = useState("basic");
  const { formData } = useCourseFormContext();

  const handleActiveTap = (tap: string) => {
    if (tap !== "basic" && !formData._id) {
      toast.info("Please Fillout Basic Course Information!");
      return;
    }
    setActiveTab(tap);
  };

  return (
    <div className="w-full  bg-white rounded-sm border ">
      <div className="overflow-x-auto ">
        <div className="flex justify-center gap-2 p-3  border-b border-gray-200 w-full overflow-x-auto scrollbar-hide snap-x">
          <Taps
            label="Basic Information"
            icon={
              <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
            }
            Click={handleActiveTap}
            tap="basic"
            activeTap={activeTab}
          />
          <Taps
            label="Curriculum"
            icon={<Layers className="text-gray-500 w-4 h-4 hidden md:block" />}
            Click={handleActiveTap}
            tap="curriculum"
            activeTap={activeTab}
          />
          <Taps
            label="Publish Course"
            icon={
              <CloudUpload className="text-gray-500 w-4 h-4 hidden md:block" />
            }
            Click={handleActiveTap}
            tap="publish"
            activeTap={activeTab}
          />
        </div>
      </div>
      {activeTab === "basic" && (
        <BasicCourseInformation handleTap={handleActiveTap} />
      )}
      {activeTab === "curriculum" && <CourseCurriculum />}
      {activeTab == "publish" && <Publish />}
    </div>
  );
}
