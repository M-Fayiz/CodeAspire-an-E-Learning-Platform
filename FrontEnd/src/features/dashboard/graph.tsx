import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

export interface graphPrps {
  date: string;
  value: number;
}

function RevenueChart({ data ,label}: { data: graphPrps[] ,label:string}) {
  return (
    <ChartContainer
      config={{
        value: { label: label, color: "var(--chart-1)" }, 
      }}
      className="h-[280px] w-full"
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} opacity={0.3} />
        <XAxis dataKey="date" tickMargin={8} />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />

        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillRevenue)"
          stroke="var(--chart-1)"
          strokeWidth={2}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

export default RevenueChart;
