import Taps from "@/components/common/Taps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/context/auth.context";
import MentorProfile from "@/features/courses_list/Details/AboutMentor";
import Banner from "@/features/courses_list/Details/Banner";
import CourseOverview from "@/features/courses_list/Details/OverView";
import CommentsSection from "@/features/courses_list/Details/Review";
import CurriculumProgress from "@/features/courses_list/Enrolled Course/Progress";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import type { IEnrolledCoursedetailsDTO } from "@/types/DTOS/enrollements.dto";
import {
  ClipboardPen,
  PlayCircle,
  Star,
  TableOfContentsIcon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const EnrolledCourseDetails = () => {
  const [activeTap, setActiveTap] = useState("overview");
  const [enrolledCourse, setEnrolledCourse] =
    useState<IEnrolledCoursedetailsDTO | null>(null);
  const [videoUrl, setVideoUrl] = useState({ url: "", title: "", lecture: "" });
  const { user } = useAuth();

  const handleVideoEnd = async (lecture: string) => {
    if (lecture) {
      const result = await EnrolledService.updateProgress(
        enrolledCourse?._id as string,
        lecture,
      );
      if (result) {
        console.log(" this is the result :", result);
        setEnrolledCourse((prv) => (prv ? { ...prv, progress: result } : prv));
        // console.log('after the updation :',enrolledCourse)
      }
    }
  };

  const { id } = useParams();

  const handle = (tap: string) => setActiveTap(tap);

  useEffect(() => {
    (async () => {
      const data = await EnrolledService.getEnrolledCourseDetails(id as string);
      if (data) {
        setEnrolledCourse(data);
      }
    })();
  }, [id]);

  const setVideo = (url: string, title: string, lecture: string) => {
    setVideoUrl((prev) => ({ ...prev, url, title, lecture }));
  };

  // console.log("sessions :", enrolledCourse?.course.sessions);
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-2 space-y-6">
          {!videoUrl.url ? (
            <div className="bg-white">
              {enrolledCourse && (
                <Banner
                  course={enrolledCourse as IEnrolledCoursedetailsDTO}
                  courseId={enrolledCourse?.courseId as string}
                  description={enrolledCourse?.course.description as string}
                  imageUrl={enrolledCourse?.course.thumbnail as string}
                  title={enrolledCourse?.course.title as string}
                  isEnrolled={true}
                />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-purple-50 p-4">
                <video
                  key={videoUrl.url}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  className="w-full rounded-xl shadow-md"
                  onEnded={() => handleVideoEnd(videoUrl.lecture)}
                >
                  <source src={videoUrl.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 text-center">
                  {videoUrl.title}
                </h2>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-center border-b p-4 border-gray-200">
            <Taps
              label="overview"
              icon={
                <ClipboardPen
                  className={`${activeTap == "overview" ? "text-white" : "text-gray-500 w-4 h-4 hidden md:block"}`}
                />
              }
              Click={handle}
              tap="overview"
              activeTap={activeTap}
            />
            <Taps
              label="mentor"
              icon={
                <User
                  className={`${activeTap == "mentor" ? "text-white" : "text-gray-500 w-4 h-4 hidden md:block"}`}
                />
              }
              Click={handle}
              tap="mentor"
              activeTap={activeTap}
            />
            <Taps
              label="curriculum"
              icon={
                <TableOfContentsIcon
                  className={`${activeTap == "curriculum" ? "text-white" : "text-gray-500 w-4 h-4 hidden md:block"}`}
                />
              }
              Click={handle}
              tap="curriculum"
              activeTap={activeTap}
            />
            <Taps
              label="Reviews"
              icon={
                <Star
                  className={`${activeTap == "Reviews" ? "text-white" : "text-gray-500 w-4 h-4 hidden md:block"}`}
                />
              }
              Click={handle}
              tap="Reviews"
              activeTap={activeTap}
            />
          </div>

          <div className="p-4 md:p-6 gridg-cols-4">
            {activeTap === "overview" && <CourseOverview />}
            {activeTap === "mentor" && (
              <MentorProfile
                mentorId={enrolledCourse?.course.mentorsId._id as string}
              />
            )}
            {activeTap === "curriculum" && (
              <div className="p-5">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Curriculum
                  </h2>
                  <p className="text-gray-600">
                    {enrolledCourse?.course.sessions.length} sections • lessons
                    •
                  </p>
                </div>
                <div className="space-y-2">
                  {enrolledCourse?.course.sessions.map((session) => (
                    <Accordion
                      key={session._id}
                      className="border border-gray-200 rounded-lg overflow-hidden mb-3 shadow-sm"
                      type="single"
                      collapsible
                    >
                      <AccordionItem value={`session-${session._id}`}>
                        <AccordionTrigger className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 text-lg flex items-center justify-between text-left transition-colors text-gray-900">
                          <div className="flex flex-col">
                            <span>{session.title}</span>
                            <span className="text-sm text-gray-500">
                              {session.lectures.length} lectures
                            </span>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="bg-white">
                          <div className="divide-y divide-gray-100">
                            {session.lectures.map((lecture) => (
                              <button
                                key={lecture._id}
                                className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 focus:bg-blue-50 transition-colors"
                                onClick={() =>
                                  setVideo(
                                    lecture.lectureContent as string,
                                    lecture.title,
                                    lecture._id as string,
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-5 h-5 text-blue-500" />
                                  <span className="text-gray-800 text-sm">
                                    {lecture.title}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </div>
            )}
            {activeTap === "Reviews" && (
              <CommentsSection
                userId={user!.id}
                courseId={enrolledCourse?.course._id as string}
                enrolledId={enrolledCourse?._id as string}
                starRating={enrolledCourse?.rating as number}
              />
            )}
          </div>
        </div>
        {enrolledCourse?.course?.sessions && (
          <div className="ls:col-span-1">
            <CurriculumProgress
              sessions={enrolledCourse.course.sessions}
              progress={enrolledCourse.progress}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EnrolledCourseDetails;
