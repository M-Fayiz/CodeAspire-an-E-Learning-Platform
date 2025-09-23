import Taps from "@/components/common/Taps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MentorProfile from "@/features/courses_list/Details/AboutMentor";
import Banner from "@/features/courses_list/Details/Banner";
import CourseOverview from "@/features/courses_list/Details/OverView";
import CurriculumProgress from "@/features/courses_list/Enrolled Course/Progress";
import { EnrolledService } from "@/service/client-API/Learner/enrolledCourse.service";
import type { ISession } from "@/types/DTOS/courses.types";
import type {
  ICourseProgess,
  IEnrolledCoursedetailsDTO,
} from "@/types/DTOS/enrollements.dto";
import { ClipboardPen, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const EnrolledCourseDetails = () => {
  const [activeTap, setActiveTap] = useState("overview");
  const [enrolledCourse, setEnrolledCourse] =
    useState<IEnrolledCoursedetailsDTO | null>(null);
  const [videoUrl, setVideoUrl] = useState({ url: "", title: "", lecture: "" });

  const handleVideoEnd = async (lecture: string) => {
    if (lecture) {
      const result = await EnrolledService.updateProgress(
        enrolledCourse?._id as string,
        lecture,
      );
      if (result) {
        setEnrolledCourse((prv) => (prv ? { ...prv, progress: result } : prv));
        console.log('after the updation :',enrolledCourse)
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

  console.log("sessions :", enrolledCourse?.course.sessions);
  return (
    <>
      <div className="flex">
        <div className="col-span-3">
          {!videoUrl.url ? (
            <div className="bg-white p-2 md:p-5">
              <Banner
                courseId={enrolledCourse?.courseId as string}
                description={enrolledCourse?.course.description as string}
                imageUrl={enrolledCourse?.course.thumbnail as string}
                title={enrolledCourse?.course.title as string}
                isEnrolled={true}
              />
            </div>
          ) : (
            <div className="relative max-w-5xl mx-auto bg-white  rounded-2xl overflow-hidden border border-gray-200">
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
          <div className="flex justify-center border-b mt-2 p-5 border-gray-200 px-6">
            <Taps
              label="overview"
              icon={
                <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
              }
              Click={handle}
              tap="overview"
              activeTap={activeTap}
            />
            <Taps
              label="mentor"
              icon={
                <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
              }
              Click={handle}
              tap="mentor"
              activeTap={activeTap}
            />
            <Taps
              label="curriculum"
              icon={
                <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
              }
              Click={handle}
              tap="curriculum"
              activeTap={activeTap}
            />
          </div>

          <div className="p-2 md:p-5">
            {activeTap === "overview" && <CourseOverview />}
            {activeTap === "mentor" && (
              <MentorProfile
                id={enrolledCourse?.course.mentorsId._id as string}
              />
            )}
          </div>
          <div>
            {activeTap === "curriculum" && (
              <div className="p-5">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Curriculum
                  </h2>
                  <p className="text-gray-600">
                    {enrolledCourse && enrolledCourse.course.sessions.length}{" "}
                    sections • lessons •
                  </p>
                </div>
                <div className="space-y-2 pl-10 pr-10">
                  {enrolledCourse &&
                    enrolledCourse.course.sessions.map((session) => (
                      <Accordion
                        key={session._id}
                        className="border border-gray-200 rounded-lg overflow-hidden mb-3 shadow-sm"
                        type="single"
                        collapsible
                      >
                        <AccordionItem value={`session-${session._id}`}>
                          <AccordionTrigger className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 text-lg flex items-center justify-between text-left transition-colors  text-gray-900">
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
          </div>
        </div>
        {enrolledCourse?.course?.sessions && (
          <CurriculumProgress
            sessions={enrolledCourse.course.sessions}
            progress={enrolledCourse.progress}
          />
        )}
      </div>
    </>
  );
};

export default EnrolledCourseDetails;
