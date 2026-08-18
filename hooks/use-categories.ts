"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoryOptions } from "@/lib/api/categories";
import { queryKeys } from "@/lib/api/query-keys";

export function useCategoryOptions() {
  return useQuery({
    queryKey: queryKeys.categories.options,
    queryFn: getCategoryOptions,
  });
}
