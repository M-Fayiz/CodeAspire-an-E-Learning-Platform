"use client";

import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

type CalendarMode = "single" | "range";
type DateValue = Date | DateRange | undefined;

interface DateFilterProps {
  mode: CalendarMode;
  value: DateValue;
  onChange: (value: DateValue) => void;
}

export function DateFilter({ mode, value, onChange }: DateFilterProps) {
  if (mode === "single") {
    return (
      <Calendar
        mode="single"
        selected={value as Date | undefined}
        onSelect={(date) => onChange(date)}
        className="rounded-lg border shadow-sm"
      />
    );
  }

  return (
    <Calendar
      mode="range"
      selected={value as DateRange | undefined}
      onSelect={(range) => onChange(range)}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  );
}
