"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const revenueData = [
  {
    name: "Course",
    admin: 12000,
    mentor: 38000,
  },
  {
    name: "Slot",
    admin: 5000,
    mentor: 15000,
  },
];

export function RevenueStackedChart() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Revenue Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Admin vs Mentor (Course & Slot)
        </p>
      </CardHeader>

      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            {/* Admin share */}
            <Bar
              dataKey="admin"
              stackId="revenue"
              fill="#9CA3AF" // gray-400
              radius={[0, 0, 6, 6]}
            />

            {/* Mentor share */}
            <Bar
              dataKey="mentor"
              stackId="revenue"
              fill="#F97316" // orange-500
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
