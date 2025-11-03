import Taps from "@/components/common/Taps";
import { Spinner } from "@/components/templates/Spinner";
import HeroSection from "@/features/admin/Course/HeroSection";
import courseService from "@/service/mentor/course.service";
import type { IFormCourseDTO } from "@/types/DTOS/courses.types";
import { ClipboardPen, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AdminCourseActions from "@/features/admin/Course/AdminAction";
import { toast } from "sonner";
import MentorProfile from "@/features/courses_list/Details/AboutMentor";

function AdminCourseDetails() {
  const { id } = useParams();
  const [course, setCourses] = useState<IFormCourseDTO | null>(null);
  const [videoUrl, setVideoUrl] = useState({ url: "", title: "" });
  const [activeTab, setActiveTab] = useState("Curriculum");

  useEffect(() => {
    async function fetchCourse() {
      const coursedata = await courseService.getCourseDetails(id as string);
      if (coursedata) {
        setCourses(coursedata);
      }
    }
    fetchCourse();
  }, [id]);
  if (!course) {
    return <Spinner fullScreen variant="theme" />;
  }

  const handleTaps = (tap: string) => {
    if (tap !== "Curriculum") {
      setVideoUrl({ url: "", title: "" });
    }
    setActiveTab(tap);
  };

  const setVideo = (url: string, title: string) => {
    setVideoUrl((prev) => ({ ...prev, url, title }));
  };

  const handleApprove = async () => {
    const status = await courseService.approveCourse(course._id);
    if (status && course) {
      toast.success("Course status successfully approved");
      setCourses((prev) => (prev ? { ...prev, status } : prev));
    }
  };
  const handlereject = async (feedback: string) => {
    const status = await courseService.rejectCourse(
      course._id,
      feedback,
      course.mentorsId.email,
    );
    if (status && course) {
      toast.success("Course status successfully rejected");
      setCourses((prev) => (prev ? { ...prev, status } : prev));
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white">
        {!videoUrl.url ? (
          <HeroSection courses={course} />
        ) : (
          <div className="relative max-w-5xl mx-auto bg-white  rounded-2xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-purple-50 p-4">
              <video
                key={videoUrl.url}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                className="w-full rounded-xl shadow-md"
              >
                <source src={videoUrl.url} />
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
        <div className="flex border-b mt-2 border-gray-200 px-6">
          {/* <Taps
            label="Overview"
            icon={
              <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
            }
            Click={handleTaps}
            tap="Overview"
            activeTap={activeTab}
          /> */}
          <Taps
            label="Curriculum"
            icon={
              <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
            }
            Click={handleTaps}
            tap="Curriculum"
            activeTap={activeTab}
          />
          <Taps
            label="mentor"
            icon={
              <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
            }
            Click={handleTaps}
            tap="mentor"
            activeTap={activeTab}
          />
          <Taps
            label="Action"
            icon={
              <ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />
            }
            Click={handleTaps}
            tap="Action"
            activeTap={activeTab}
          />
        </div>
        <div>
          {activeTab === "Curriculum" && (
            <div className="p-5">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Course Curriculum
                </h2>
                <p className="text-gray-600">
                  {course.sessions.length} sections • lessons •
                </p>
              </div>
              <div className="space-y-2 pl-10 pr-10">
                {course.sessions.map((session) => (
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
        <div>
          {activeTab === "Action" && (
            <AdminCourseActions
              onAppprove={handleApprove}
              onReject={handlereject}
              status={course.status}
            />
          )}
          {activeTab === "mentor" && (
            <MentorProfile mentorId={course?.mentorsId._id as string} />
          )}
        </div>
      </div>
    </>
  );
}

export default AdminCourseDetails;
