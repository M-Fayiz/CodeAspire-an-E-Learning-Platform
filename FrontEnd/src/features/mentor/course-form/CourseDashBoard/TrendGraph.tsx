"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  //   ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChartDataDTO } from "@/types/DTOS/courseDashboard.dto";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import type { ChartFilter } from "@/types/enrollent.types";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "enrolled",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface cahrtPrps {
  courseId: string;
}
export const ChartAreaInteractive: React.FC<cahrtPrps> = ({ courseId }) => {
  const [timeRange, setTimeRange] = useState<ChartFilter>("today");
  const [chartData, setChartData] = useState<ChartDataDTO[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await EnrolledService.FilterGraph(courseId, timeRange);
      if (data) {
        setChartData(data);
      }
    })();
  }, [timeRange, courseId]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>Showing total enrolled Studens</CardDescription>
        </div>
        <Select value={timeRange}  onValueChange={(value) => setTimeRange(value as ChartFilter)}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Custom" className="rounded-lg">
              Custom
            </SelectItem>
            <SelectItem value="Last Month" className="rounded-lg">
              Last Month
            </SelectItem>
            <SelectItem value="Last Week" className="rounded-lg">
              Last Week
            </SelectItem>
            <SelectItem value="today" className="rounded-lg">
              today
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            {chartData && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="enrolled"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke="var(--color-mobile)"
                  stackId="a"
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
