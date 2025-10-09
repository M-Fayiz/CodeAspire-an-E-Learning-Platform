import React, { useMemo } from "react";
import { Check, Circle } from "lucide-react";
import type { ICourseProgess } from "@/types/DTOS/enrollements.dto";
import type { ISession } from "@/types/DTOS/courses.types";

interface CurriculumProgressProps {
  progress: ICourseProgess;
  sessions: ISession[];
}

const CurriculumProgress: React.FC<CurriculumProgressProps> = ({
  progress,
  sessions,
}) => {
  const lectureCount = useMemo(() => {
    if (!sessions) return 0;
    return sessions.reduce((acc, vl) => acc + (vl.lectures?.length || 0), 0);
  }, [sessions]);
  const set = new Set(progress.completedLectures);
  const progresPercentage = Math.floor((set.size / lectureCount) * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{"title"}</h2>
        <span className="text-sm text-gray-500 font-medium">
          {progress.completedLectures.length}/{lectureCount}
        </span>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progresPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progresPercentage}% Complete
        </p>
      </div>

      <div className="space-y-1 max-h-[350px] overflow-y-auto">
        {sessions &&
          sessions.map((session, ind) => (
            <div key={session._id}>
              <div className="flex items-center py-2">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">
                      {ind + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-800">
                  {session.title}
                </h3>
              </div>

              {session.lectures?.map((lecture) => {
                const isCompleted = set.has(lecture._id as string);
                return (
                  <div
                    key={lecture._id}
                    className="flex items-center py-3 ml-4 border-l-2 border-gray-100"
                  >
                    <div className="flex-shrink-0 mr-3 -ml-1">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                          <Circle
                            className="w-3 h-3 text-gray-300"
                            fill="currentColor"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          isCompleted
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {lecture.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CurriculumProgress;
