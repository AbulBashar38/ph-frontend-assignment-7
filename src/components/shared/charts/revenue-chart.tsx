"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils";

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

// "2026-05" → "May"
const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleString("en", { month: "short" });

// Monthly rent collected (bar per month)
export default function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  if (data.every((point) => point.revenue === 0)) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-1 rounded-xl bg-muted/40 text-center">
        <p className="font-medium">No rent collected yet</p>
        <p className="text-sm text-muted-foreground">
          Paid rent will show up here month by month.
        </p>
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: 4, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={monthLabel}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(value: number) =>
            value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => monthLabel(String(value))}
              formatter={(value) => formatCurrency(Number(value))}
            />
          }
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
