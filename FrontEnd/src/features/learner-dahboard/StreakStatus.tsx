import type { ILearnerStreask } from "@/types/DTOS/learnerDashboard.type";
import generateLast365Days from "@/utility/generateDays.util";
import { useState } from "react";



type Props = {
  activeDates: string[];
  streakData: ILearnerStreask;
};

export default function LearningCalendar({ activeDates, streakData }: Props) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const days = generateLast365Days();
  const normalizedActiveDates = activeDates.map(d => 
    new Date(d).toISOString().slice(0, 10)
  );
  const activeSet = new Set(normalizedActiveDates);


  const monthsData: Record<string, string[][]> = {};
  let currentMonth = '';
  let currentWeek: string[] = [];

  days.forEach((date, index) => {
    const monthKey = date.slice(0, 7); 
    
    const dayOfWeek = new Date(date).getDay();

    if (monthKey !== currentMonth) {
      if (currentWeek.length > 0) {
        if (!monthsData[currentMonth]) monthsData[currentMonth] = [];
        monthsData[currentMonth].push(currentWeek);
      }
      currentMonth = monthKey;
      currentWeek = [];
    }

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      if (!monthsData[currentMonth]) monthsData[currentMonth] = [];
      monthsData[currentMonth].push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(date);

    if (index === days.length - 1 && currentWeek.length > 0) {
      if (!monthsData[currentMonth]) monthsData[currentMonth] = [];
      monthsData[currentMonth].push(currentWeek);
    }
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getMonthLabel = (monthKey: string) => {
    const month = parseInt(monthKey.split('-')[1]) - 1;
    return monthNames[month];
  };

  const totalActiveDays = activeDates.length;

  return (
  <div className="w-full max-w-full bg-white rounded-md border border-gray-200 p-4 sm:p-5">
    {/* Stats header */}
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-6 text-sm">
      <div>
        <span className="text-gray-500">Total active days: </span>
        <span className="font-semibold text-gray-900">
          {totalActiveDays}
        </span>
      </div>

      <div>
        <span className="text-gray-500">Max streak: </span>
        <span className="font-semibold text-gray-900">
          {streakData.longest}
        </span>
      </div>

      <div>
        <span className="text-gray-500">Current: </span>
        <span className="font-semibold text-orange-600">
          {streakData.current}
        </span>
      </div>
    </div>

    {/* Calendar */}
    <div className="relative overflow-x-auto">
      <div className="inline-flex gap-3 min-w-max">
        {Object.entries(monthsData).map(([monthKey, weeks]) => (
          <div key={monthKey} className="flex flex-col">
            {/* Month label */}
            <div className="text-xs text-gray-500 mb-2 h-4 text-center">
              {getMonthLabel(monthKey)}
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-1"
                >
                  {week.map((date) => {
                    const isActive = activeSet.has(date);

                    return (
                      <div
                        key={date}
                        onMouseEnter={() => setHoveredDate(date)}
                        onMouseLeave={() => setHoveredDate(null)}
                        className={`
                          w-3 h-3 sm:w-3.5 sm:h-3.5
                          rounded-sm transition-all cursor-pointer
                          ${isActive
                            ? "bg-orange-500 hover:bg-orange-600 sm:hover:scale-125"
                            : "bg-gray-200 hover:bg-gray-300"
                          }
                        `}
                        title={date}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredDate && (
        <div className="absolute -top-10 left-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap">
          {new Date(hoveredDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {activeSet.has(hoveredDate) && (
            <span className="ml-2 text-orange-400">● Active</span>
          )}
        </div>
      )}
    </div>
  </div>
);

}