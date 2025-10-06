import { filter } from "../types/enrollment.types";

export function timeFilter(filter?:filter,startDay?:string,endDay?:string):{start:Date,end:Date}{
    let start: Date;
    let end: Date = new Date();

    switch (filter) {
      case "today":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;

      case "Last Week":
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;

      case "Last Month":
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        break;

      case "Custom":
        start = new Date(startDay!);
        end = new Date(endDay!);
        break;

      default:
        start = new Date();
        start.setHours(0, 0, 0, 0);
    }
    return {start,end}
}