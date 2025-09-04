import Taps from "@/components/common/Taps";
import MentorProfile from "@/features/courses_list/Details/AboutMentor";
import Banner from "@/features/courses_list/Details/Banner";
import CourseOverview from "@/features/courses_list/Details/OverView";
import courseService from "@/service/client-API/mentor/course.service";
import type { IFormCourseDTO } from "@/types/courses.types";
import { ClipboardPen } from "lucide-react";
import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";

const CourseDetails = () => {
  const [activeTap, setActiveTap] = useState("overview");
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<IFormCourseDTO | null>(null);
  useEffect(() => {
    (async () => {
      const result = await courseService.getCourseDetails(id as string);
      if (result) {
        setCourse(result);
      }
    })();
  }, [id]);




  const handle = (tap: string) => setActiveTap(tap);



  return (
    <div>
      <div className="col-span-3">
        <div className="bg-white p-2 md:p-5">
          <Banner
            courseId={course?._id as string}
            description={course?.description as string}
            imageUrl={course?.thumbnail as string}
            title={course?.title as string}
          />
        </div>

   
        <div className="flex justify-center border-b mt-2 p-5 border-gray-200 px-6">
          <Taps
            label="overview"
            icon={<ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />}
            Click={handle}
            tap="overview"
            activeTap={activeTap}
          />
          <Taps
            label="mentor"
            icon={<ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />}
            Click={handle}
            tap="mentor"
            activeTap={activeTap}
          />
        </div>

        
        

        <div className="p-2 md:p-5">
          {activeTap === "overview" && <CourseOverview />}
          {activeTap === "mentor" && (
            <MentorProfile id={course?.mentorsId._id as string} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;




