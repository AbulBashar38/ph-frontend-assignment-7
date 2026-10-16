"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatEnum } from "@/utils";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Share of records per status, with the total in the middle and a legend underneath
export default function StatusDonut({
  data,
  centerLabel,
}: {
  data: Record<string, number>;
  centerLabel: string;
}) {
  const entries = Object.entries(data).map(([status, count], index) => ({
    status,
    count,
    fill: COLORS[index % COLORS.length],
  }));
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);
  const config = Object.fromEntries(
    entries.map((entry) => [
      entry.status,
      { label: formatEnum(entry.status), color: entry.fill },
    ]),
  ) satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <ChartContainer config={config} className="aspect-square h-48 shrink-0">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="status" hideLabel />}
          />
          <Pie
            data={
              total > 0
                ? entries
                : [{ status: "NONE", count: 1, fill: "var(--muted)" }]
            }
            dataKey="count"
            nameKey="status"
            innerRadius={56}
            strokeWidth={4}
          >
            {(total > 0 ? entries : []).map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) =>
                viewBox && "cx" in viewBox && "cy" in viewBox ? (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-heading text-2xl font-bold"
                    >
                      {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      {centerLabel}
                    </tspan>
                  </text>
                ) : null
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="grid w-full gap-2 text-sm">
        {entries.map((entry) => (
          <li
            key={entry.status}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              {formatEnum(entry.status)}
            </span>
            <span className="font-semibold tabular-nums">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
