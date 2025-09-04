// MyCourseCard.tsx
import { sharedService } from "@/service/client-API/shared.service";
import type { IFormCourseDTO } from "@/types/courses.types";
import { useEffect, useState } from "react";

interface CourseCardProps {
  course: IFormCourseDTO;
  onEdit: () => void;
}

const MyCourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
  const [image, setImage] = useState("");
  useEffect(() => {
    (async () => {
      const imageUrl = await sharedService.getPreSignedDownloadURL(
        course.thumbnail,
      );
      if (imageUrl) {
        setImage(imageUrl);
      }
    })();
  }, [course]);
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold text-white
              ${course.status === "draft" ? "bg-amber-400" : ""}
              ${course.status === "published" ? "bg-blue-500" : ""}
              ${course.status === "approved" ? "bg-green-500" : ""}
              ${course.status === "rejected" ? "bg-red-500" : ""}`}
          >
            {course.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            {course.category.title || "Uncategorized"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {course.level || "All Levels"}
          </span>
          <span className="text-lg font-bold text-orange-600">
            {`$${course.price}`}
          </span>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Edit Course
          </button>
          {/* <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium">
            Delete
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default MyCourseCard;
