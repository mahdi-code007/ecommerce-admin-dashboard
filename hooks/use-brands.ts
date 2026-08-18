"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrandOptions } from "@/lib/api/brands";
import { queryKeys } from "@/lib/api/query-keys";

export function useBrandOptions() {
  return useQuery({
    queryKey: queryKeys.brands.options,
    queryFn: getBrandOptions,
  });
}
