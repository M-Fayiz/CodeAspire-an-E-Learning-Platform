

const LearnerDashboardSkeleton = () => {
  return (
    <div className="space-y-8">

      
      <div className="space-y-2 animate-pulse">
        <div className="h-6 w-56 bg-gray-300 rounded"></div>
        <div className="h-4 w-72 bg-gray-200 rounded"></div>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="bg-white rounded-2xl shadow p-6 animate-pulse" key={index}>
            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

     
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="h-5 w-40 bg-gray-300 rounded mb-6 animate-pulse"></div>

        <div className="divide-y">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex items-center justify-between py-4 animate-pulse" key={index}>
                <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                </div>

                <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LearnerDashboardSkeleton;
