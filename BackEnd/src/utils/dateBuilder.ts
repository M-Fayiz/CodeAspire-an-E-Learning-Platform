import { FilterQuery } from "mongoose";
import { FilterByDate } from "../const/filter.const"; 


export function buildDateFilter<T>(
  filter: string
): FilterQuery<T> {
  const now = new Date();
  const clean = filter.trim().toLowerCase();

  let startDate: Date | null = null;
  const endDate = new Date(); 

  switch (clean) {
    case FilterByDate.Today.toLowerCase():
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;

    case FilterByDate.WEEK.toLowerCase():
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      break;

    case FilterByDate.MONTH.toLowerCase():
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
      break;

    case FilterByDate.YEAR.toLowerCase():
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      break;

    default:
     
      return {};
  }

  return {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };
}
