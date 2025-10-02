export function TabSkeleton() {
  return (
    <div className="flex gap-2 animate-pulse">
      {/* Simulate 3 loading tabs */}
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
    </div>
  );
}
