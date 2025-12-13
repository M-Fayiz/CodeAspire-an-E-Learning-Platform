import Taps from "@/components/common/Taps";
import Header from "@/components/layout/landing/header";
import BannerSkeleton from "@/components/skelton/courseDetailSkelton";
import { TabSkeleton } from "@/components/skelton/TapSkelton";
import { useAuth } from "@/context/auth.context";
import MentorProfile from "@/features/courses_list/Details/AboutMentor";
import Banner from "@/features/courses_list/Details/Banner";
import CourseOverview from "@/features/courses_list/Details/OverView";
import courseService from "@/service/mentor/course.service";
import type { IFormCourseDTO } from "@/types/DTOS/courses.dto.types";
import { ClipboardPen, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const [activeTap, setActiveTap] = useState("overview");
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<IFormCourseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await courseService.getCourseDetails(
        id as string,
        user!.id,
      );
      if (result) {
        setLoading(false);
        setCourse(result);
      }
    })();
  }, [id]);

  const handle = (tap: string) => setActiveTap(tap);
  console.log(" this is the course ", course);
  return (
    <div>
      <Header />
      <div className="relative top-14 col-span-3 ">
        <div className="absolute -top-25 right-25 w-80 h-150 bg-orange-400  rounded-2xl rotate-12 "></div>
        <div className="bg-white p-2 md:p-5">
          {/* <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center"> */}
          {loading && <BannerSkeleton />}
          {!loading && (
            <Banner
              courseId={course?._id as string}
              description={course?.description as string}
              imageUrl={course?.thumbnail as string}
              title={course?.title as string}
              isEnrolled={course?.isEnrolled}
              course={course as IFormCourseDTO}
            />
          )}
        </div>

        <div className="flex justify-center gap-2 border-b mt-2 p-5  px-6">
          {loading ? (
            <TabSkeleton />
          ) : (
            <>
              <Taps
                label="overview"
                icon={
                  <ClipboardPen className="text-white-500 w-4 h-4 hidden md:block" />
                }
                Click={handle}
                tap="overview"
                activeTap={activeTap}
              />
              <Taps
                label="mentor"
                icon={
                  <User className="text-white-500 w-4 h-4 hidden md:block" />
                }
                Click={handle}
                tap="mentor"
                activeTap={activeTap}
              />
            </>
          )}
        </div>

        <div className="p-2 md:p-5">
          {activeTap === "overview" && <CourseOverview />}
          {activeTap === "mentor" && (
            <MentorProfile
              mentorId={course?.mentorsId._id as string}
              courseId={course?._id as string}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
