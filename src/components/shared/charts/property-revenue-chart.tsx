"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils";

const config = {
  revenue: { label: "Collected", color: "var(--chart-2)" },
} satisfies ChartConfig;

// Long titles are cut so the bars keep their room
const shortTitle = (title: string) =>
  title.length > 24 ? `${title.slice(0, 23)}…` : title;

// All-time rent collected per property (horizontal bars, highest first)
export default function PropertyRevenueChart({
  data,
}: {
  data: { title: string; revenue: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-1 rounded-xl bg-muted/40 text-center">
        <p className="font-medium">No rent collected yet</p>
        <p className="text-sm text-muted-foreground">
          Each property's earnings will show up here.
        </p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: Math.max(160, data.length * 56) }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="title"
          tickLine={false}
          axisLine={false}
          width={184}
          tickFormatter={shortTitle}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(Number(value))}
            />
          }
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[0, 6, 6, 0]}
          barSize={28}
        />
      </BarChart>
    </ChartContainer>
  );
}
