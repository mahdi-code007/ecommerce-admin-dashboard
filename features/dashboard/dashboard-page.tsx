"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RevenueChart,
  StatusBreakdownChart,
  TopProductsChart,
} from "@/features/dashboard/components/dashboard-charts";
import { DashboardKpiCards } from "@/features/dashboard/components/dashboard-kpi-cards";
import {
  LowStockCard,
  TopCitiesCard,
  TopCouponsCard,
} from "@/features/dashboard/components/dashboard-lists";
import { useStatsOverview } from "@/features/dashboard/queries";
import type { StatsRange } from "@/features/dashboard/types";

const RANGE_OPTIONS: { value: StatsRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function DashboardPage() {
  const [range, setRange] = useState<StatsRange>("30d");
  const statsQuery = useStatsOverview({ range });
  const overview = statsQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Sales, fulfillment, and catalog health from the admin stats API.
          </p>
        </div>
        <Select
          value={range}
          onValueChange={(value) => setRange(value as StatsRange)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {statsQuery.isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      ) : statsQuery.isError || !overview ? (
        <p className="text-sm text-destructive">
          Could not load dashboard stats. Check that the API is running on port
          8000.
        </p>
      ) : (
        <>
          <DashboardKpiCards kpis={overview.kpis} />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <RevenueChart
              points={overview.series.points}
              granularity={overview.series.granularity}
            />
            <StatusBreakdownChart statusBreakdown={overview.statusBreakdown} />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <TopProductsChart products={overview.topProducts} />
            <LowStockCard products={overview.lowStockProducts} />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <TopCitiesCard cities={overview.topCities} />
            <TopCouponsCard coupons={overview.topCoupons} />
          </div>
        </>
      )}
    </div>
  );
}
