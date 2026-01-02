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
  const normalizedActiveDates = activeDates.map((d) =>
    new Date(d).toISOString().slice(0, 10),
  );
  const activeSet = new Set(normalizedActiveDates);

  const monthsData: Record<string, string[][]> = {};
  let currentMonth = "";
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

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonthLabel = (monthKey: string) => {
    const month = parseInt(monthKey.split("-")[1]) - 1;
    return monthNames[month];
  };

  const totalActiveDays = activeDates.length;



  return (
    <div className=" bg-white rounded-md border border-gray-200 p-2 sm:p-3">
      <div className="px-2 sm:px-4 py-2 ">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Learning Streak
        </h3>
      </div>
      <div className="flex pl-4  sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-6 text-sm">
        <div>
          <span className="text-gray-500">Total active days: </span>
          <span className="font-semibold text-gray-900">{totalActiveDays}</span>
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
  
      <div className="relative overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300">

       <div className="relative w-fit overflow-hidden">
    <div className="flex gap-3 pb-3 px-3 w-max">

      {Object.entries(monthsData).map(([monthKey, weeks]) => (
        <div key={monthKey} className="flex flex-col shrink-0">
          {/* Month Label */}
          <div className="text-[15px] sm:text-xs text-gray-500 mb-2 text-center">
            {getMonthLabel(monthKey)}
          </div>

          
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
                          w-2 h-2 sm:w-3.5 sm:h-3.5
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
  </div>

        
        {hoveredDate && (
          <div
            className="
                absolute 
                -top-10 left-1/2 -translate-x-1/2
                px-3 py-1.5
                bg-gray-900 text-white text-xs
                rounded shadow-lg
                pointer-events-none
                whitespace-nowrap
                z-50
              "
          >
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
