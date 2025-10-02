export default function BannerSkeleton() {
  return (
    <div className="relative w-full py-5 px-6 md:px-16 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-center relative gap-10 animate-pulse">
        
        {/* Left Content */}
        <div className="relative flex-1 p-5 space-y-4">
          {/* Title */}
          <div className="h-8 md:h-10 bg-gray-300 rounded w-3/4"></div>
          
          {/* Description (3 lines) */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-6">
            <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Right Image Placeholder */}
        <div className="relative flex-1 max-w-md">
          <div className="w-full h-56 md:h-72 bg-gray-200 rounded-lg shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}
