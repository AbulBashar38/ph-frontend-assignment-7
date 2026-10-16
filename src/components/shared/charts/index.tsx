"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Recharts is heavy, so the charts load only on the pages that show them
export const RevenueChart = dynamic(() => import("./revenue-chart"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});

export const StatusDonut = dynamic(() => import("./status-donut"), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full" />,
});
