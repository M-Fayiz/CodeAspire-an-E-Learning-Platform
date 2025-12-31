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
import type { IEnrolledCoursedetailsDTO } from "@/types/DTOS/enrollements.dto.type";
import {
  ClipboardPen,
  PlayCircle,
  Star,
  TableOfContentsIcon,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const EnrolledCourseDetails = () => {
  const [activeTap, setActiveTap] = useState("overview");
  const [enrolledCourse, setEnrolledCourse] =
    useState<IEnrolledCoursedetailsDTO | null>(null);
  const videRef=useRef<HTMLDivElement>(null)
  const [videoUrl, setVideoUrl] = useState({
    url: "",
    title: "",
    lecture: "",
    sessionId: "",
  });
  const { user } = useAuth();
 const scrollToBottom = () => {
    videRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(scrollToBottom, [messages]);
  const handleVideoEnd = async (lecture: string, sessionId: string) => {
    if (lecture) {
      const result = await EnrolledService.updateProgress(
        enrolledCourse?._id as string,
        lecture,
        sessionId,
      );
      if (result) {
        setEnrolledCourse((prv) => (prv ? { ...prv, progress: result } : prv));
      }
    }
  };

  const { enrolledId } = useParams();

  const handle = (tap: string) => setActiveTap(tap);

  useEffect(() => {
    (async () => {
      const data = await EnrolledService.getEnrolledCourseDetails(
        enrolledId as string,
      );
      if (data) {
        setEnrolledCourse(data);
      }
    })();
  }, [enrolledId]);

  const setVideo = (
    url: string,
    title: string,
    lecture: string,
    sessionId: string,
  ) => {
    setVideoUrl((prev) => ({ ...prev, url, title, lecture, sessionId }));
  };

  // console.log("sessions :", enrolledCourse?.course.sessions);
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-4 space-y-6">
          {!videoUrl.url ? (
            <div className="bg-white">
              {enrolledCourse && (
                <Banner
                  level={enrolledCourse.course.level as string}
                  courseId={enrolledCourse?.courseId as string}
                  description={enrolledCourse?.course.description as string}
                  imageUrl={enrolledCourse?.course.thumbnail as string}
                  title={enrolledCourse?.course.title as string}
                  enrolledId={enrolledCourse._id as string}
                  price={enrolledCourse.course.price}
                  onEnrolledPage={true}
                />
              )}
            </div>
          ) : (
            <div ref={videRef} className="bg-white rounded-sm shadow overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-orange-100 via-orange-50 to-purple-50 p-4">
                <video
                  key={videoUrl.url}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  className="w-full rounded-sm shadow-md"
                  onEnded={() =>
                    handleVideoEnd(videoUrl.lecture, videoUrl.sessionId)
                  }
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
            <div className="lg:col-span-8 space-y-6">
              {activeTap === "overview" && <CourseOverview />}
              {activeTap === "mentor" && (
                <MentorProfile
                  courseId={enrolledCourse?.courseId as string}
                  mentorId={enrolledCourse?.course.mentorId._id as string}
                  enrolledId={enrolledCourse?._id as string}
                />
              )}
              {activeTap === "curriculum" && (
                <div className="p-5">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Course Curriculum
                    </h2>
                    <p className="text-gray-600">
                      {enrolledCourse?.course.sessions.length} sections •
                      lessons •
                    </p>
                  </div>
                  <div className="space-y-2">
                    {enrolledCourse?.course.sessions
                      .filter(
                        (session) =>
                          session.lectures && session.lectures.length >= 1,
                      )
                      .map((session) => (
                        <Accordion
                          key={session._id}
                          type="single"
                          collapsible
                          className="border border-gray-200 rounded-sm overflow-hidden mb-3 shadow-sm"
                        >
                          <AccordionItem value={`session-${session._id}`}>
                            <AccordionTrigger
                              className={`w-full px-6 py-4 ${
                                session._id ==
                                enrolledCourse.progress.lastAccessedSession
                                  ? "bg-orange-50 border-l-4 border-orange-500"
                                  : "hover:bg-gray-50 focus:bg-orange-50"
                              } text-left transition-colors text-gray-900`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col gap-1">
                                  <span className="text-lg font-medium">
                                    {session.title}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {session.lectures.length} lectures
                                  </span>
                                </div>
                                <div>
                                  {session._id ==
                                    enrolledCourse.progress
                                      .lastAccessedSession && (
                                    <span className="text-xs text-orange-600 whitespace-nowrap">
                                      Last watched
                                    </span>
                                  )}
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="bg-white mt-1 ">
                              <div className="divide-y divide-gray-100">
                                {session.lectures.map((lecture) => {
                                  const isLastAccessed =
                                    enrolledCourse.progress
                                      .lastAccessedLecture === lecture._id;

                                  return (
                                    <button
                                      key={lecture._id}
                                      className={`w-full px-6 py-3 transition-colors
                                      ${
                                        isLastAccessed
                                          ? "bg-orange-50 border-l-4 border-orange-500"
                                          : "hover:bg-gray-50 focus:bg-orange-50"
                                      }
                                    `}
                                      onClick={() =>
                                        setVideo(
                                          lecture.lectureContent as string,
                                          lecture.title,
                                          lecture._id as string,
                                          session._id as string,
                                        )
                                      }
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        {/* Left side */}
                                        <div className="flex items-center gap-3">
                                          <PlayCircle
                                            className={`w-5 h-5 ${
                                              isLastAccessed
                                                ? "text-orange-600"
                                                : "text-orange-500"
                                            }`}
                                          />

                                          <span
                                            className={`text-sm ${
                                              isLastAccessed
                                                ? "text-orange-700 font-medium"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            {lecture.title}
                                          </span>
                                        </div>

                                        {/* Right side */}
                                        {isLastAccessed && (
                                          <span className="text-xs text-orange-600 whitespace-nowrap">
                                            Last watched
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
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
            {enrolledCourse?.course?.sessions && (
              <div className="lg:col-span-4">
                <CurriculumProgress
                  sessions={enrolledCourse.course.sessions}
                  progress={enrolledCourse.progress}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrolledCourseDetails;
