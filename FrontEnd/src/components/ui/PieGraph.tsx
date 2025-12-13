import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

const COLORS = ["#000000", "#808080", "#BFBFBF"];

export interface SourceOfRevanye {
  name: string;
  value: number;
}

export const RevenueDonutChart: React.FC<{ Options: SourceOfRevanye[] }> = ({
  Options,
}) => {
  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle>Revenue by Source</CardTitle>
      </CardHeader>

      <CardContent className="flex justify-center">
        <PieChart width={320} height={320}>
          <Pie
            data={Options}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            dataKey="value"
            paddingAngle={2}
          >
            {Options.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
};
