import Taps from "@/components/common/Taps";
import Header from "@/components/layout/landing/Header";
import BannerSkeleton from "@/components/skelton/CourseDetailSkelton";
import { TabSkeleton } from "@/components/skelton/TapSkelton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import MentorProfile from "@/features/courses_list/Details/AboutMentor";
import Banner from "@/features/courses_list/Details/Banner";
import CourseOverview from "@/features/courses_list/Details/OverView";
import courseService from "@/service/mentor/course.service";
import type { ICourseDetailsPageDTO, IFormCourseDTO } from "@/types/DTOS/courses.dto.types";
import { ArrowLeft, ClipboardPen, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoursePreview from "./CourseCurriculum";

const CourseDetails = () => {
  const [activeTap, setActiveTap] = useState("overview");
  const { id } = useParams<{ id: string }>();
 
  const { user } = useAuth();
  const [course, setCourse] = useState<ICourseDetailsPageDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrolledId,setEnrolledId]=useState<string|null>(null)
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await courseService.getCourseDetails(
        id as string,
        user?.id as string
      );
      if (result) {
        setCourse(result.courseDetails);
        setEnrolledId(result.enrolledId)
        setLoading(false);
      }
    })();
  }, [id]);

  const handle = (tap: string) => setActiveTap(tap);
  const navigate=useNavigate()
  return (
    <div>
      <Header />
      <div className="relative top-14 col-span-3 ">
     <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-gray-100 text-gray-500 
                  hover:bg-gray-200 hover:text-orange-500"
      >
  <ArrowLeft size={20} />
  <span className="text-lg text-grey-500 font-medium">Back</span>
</Button>

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
              enrolledId={enrolledId}
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
              <Taps
                label="curriculum "
                icon={
                  <User className="text-white-500 w-4 h-4 hidden md:block" />
                }
                Click={handle}
                tap="curriculum"
                activeTap={activeTap}
              />
            </>
          )}
        </div>

        <div className="p-2 md:p-5">
          {activeTap === "overview" && <CourseOverview />}
          {activeTap === "mentor" && (
            <MentorProfile
              mentorId={course?.mentorId._id as string}
              courseId={course?._id as string}
              enrolledId={enrolledId}
            />
          )}
          {activeTap=='curriculum'&&course?.sessions&&<CoursePreview sessions={course?.sessions}/>}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
