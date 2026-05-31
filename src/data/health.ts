import { useQuery } from "@tanstack/solid-query";

import { apiClient } from "../api/client";
import { toApiError } from "../api/errors";
import { queryKeys } from "./query-keys";
import type { Health } from "./types";

async function fetchHealth(): Promise<Health> {
  const { data, error, response } = await apiClient.GET("/health");
  if (error || !data) throw toApiError(error, response);
  return data;
}

/** Liveness of the backend, polled in the background. */
export function useHealth() {
  return useQuery(() => ({
    queryKey: queryKeys.health,
    queryFn: fetchHealth,
    staleTime: 5_000,
    refetchInterval: 10_000,
    retry: false,
  }));
}
