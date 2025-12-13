const MentorDashboardSkeleton = () => {
  const SkeletonStatCard = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonBar = () => (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full flex flex-col justify-end h-full space-y-0.5">
        <div
          className="w-full bg-gray-200 rounded-t animate-pulse"
          style={{ height: "60%" }}
        ></div>
        <div
          className="w-full bg-gray-300 animate-pulse"
          style={{ height: "25%" }}
        ></div>
        <div
          className="w-full bg-gray-400 rounded-b animate-pulse"
          style={{ height: "15%" }}
        ></div>
      </div>
      <div className="h-3 w-6 bg-gray-200 rounded mt-2 animate-pulse"></div>
    </div>
  );

  const SkeletonCourseItem = () => (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-gray-300 rounded"></div>
        <div className="h-2 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="h-2 w-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Skeleton */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
                {[...Array(14)].map((_, i) => (
                  <SkeletonBar key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Top Performing Course Skeleton */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="h-5 w-40 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <SkeletonCourseItem />
                <SkeletonCourseItem />
                <SkeletonCourseItem />
              </div>
            </div>

            {/* Your Earnings Skeleton */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-12 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-12 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 h-14 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-14 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardSkeleton;
