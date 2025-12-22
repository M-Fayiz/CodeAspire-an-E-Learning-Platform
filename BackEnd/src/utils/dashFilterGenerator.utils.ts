import { FilterByDate } from "../const/filter.const";
export function timeFilter(
  filter?: FilterByDate,
  startDay?: string,
  endDay?: string,
): { start: Date; end: Date } {

  let start: Date;
  let end: Date = new Date();

  
  end.setHours(23, 59, 59, 999);

  switch (filter) {
    case FilterByDate.Today: {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      break;
    }

    case FilterByDate.WEEK: {
      start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    }

    case FilterByDate.MONTH: {
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case FilterByDate.YEAR: {
  start = new Date();
  start.setMonth(start.getMonth() - 12);
  start.setHours(0, 0, 0, 0);
  break;
}


    case FilterByDate.CUSTOM: {
      if (!startDay || !endDay) {
        throw new Error("Start date and end date are required for custom filter");
      }

      start = new Date(startDay);
      end = new Date(endDay);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
      }

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }

    default: {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    }
  }

  return { start, end };
}

