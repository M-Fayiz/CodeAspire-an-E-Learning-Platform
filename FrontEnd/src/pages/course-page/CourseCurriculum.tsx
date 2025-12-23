import React from "react";
import { PlayCircle, FileText, Lock } from "lucide-react";
import type { ISessionWithoutContent } from "@/types/DTOS/courses.dto.types";

interface CoursePreviewProps {
  sessions: ISessionWithoutContent[];
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ sessions }) => {
    console.log('sessions :',sessions)
  if (!sessions || sessions.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No sessions available for this course.
      </p>
    );
  }

  return (
    <div className="space-y-2 pl-5 pr-5">
      {sessions.map((session, sessionIndex) => (
        <div
          key={sessionIndex}
          className="border rounded-lg p-4 bg-white"
        >
          {/* Session Title */}
          <h3 className="font-semibold text-lg text-gray-800 mb-3">
            {sessionIndex + 1}. {session.title}
          </h3>

          {/* Lectures */}
          <ul className="space-y-2">
            {session.lectures.map((lecture, lectureIndex) => (
              <li
                key={lectureIndex}
                className="flex items-center justify-between p-3 rounded-md bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {lecture.lectureType === "video" ? (
                    <PlayCircle className="text-orange-500" size={20} />
                  ) : (
                    <FileText className="text-orange-500" size={20} />
                  )}

                  <span className="text-gray-700">
                    {lecture.title}
                  </span>
                </div>

                {/* Locked icon */}
                <Lock className="text-gray-400" size={16} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CoursePreview;
