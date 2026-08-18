"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatsOverview } from "@/features/dashboard/api";
import type { StatsOverviewParams } from "@/features/dashboard/types";
import { queryKeys } from "@/shared/api/query-keys";

export function useStatsOverview(params: StatsOverviewParams) {
  return useQuery({
    queryKey: queryKeys.stats.overview(params),
    queryFn: () => getStatsOverview(params),
  });
}
