import type { InProgress } from "@/types/DTOS/learnerDashboard.type";

interface Props {
  course?: InProgress | null;
}

const InProgressCourseCard: React.FC<Props> = ({ course }) => {
  if (!course) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 text-center">
        <p className="text-gray-500 text-sm sm:text-base">
          You don’t have any course in progress right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl mt-2 border border-gray-200 bg-white p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {course.title}
          </h2>
        </div>

        {/* Percentage badge */}
        <div className="self-start rounded-full bg-orange-100 px-3 py-1 text-xs sm:text-sm font-semibold text-orange-600">
          {course.progress}%
        </div>
      </div>

      {/* Progress section */}
      <div className="space-y-2">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>

        {/* <div className="flex justify-between text-[11px] sm:text-xs text-gray-500">
          <span>
            {course.completedLectures} / {course.totalLectures} lectures
          </span>
          <span>In progress</span>
        </div> */}
      </div>

      {/* CTA */}
    </div>
  );
};

export default InProgressCourseCard;
