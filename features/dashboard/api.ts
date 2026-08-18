import { apiClient } from "@/shared/api/client";
import type { ApiSuccess } from "@/shared/api/types";
import type {
  StatsOverview,
  StatsOverviewParams,
} from "@/features/dashboard/types";

type OverviewResponse = ApiSuccess<StatsOverview>;

export async function getStatsOverview(params: StatsOverviewParams) {
  const response = await apiClient.get<OverviewResponse>(
    "/admin/stats/overview",
    {
      params: {
        range: params.range,
      },
    },
  );

  return response.data.data;
}
