import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

import { apiClient } from "../api/client";
import { toApiError } from "../api/errors";
import { queryKeys } from "./query-keys";
import type { Item, NewItem } from "./types";

async function fetchItem(id: string): Promise<Item> {
  const { data, error, response } = await apiClient.GET("/items/{id}", {
    params: { path: { id } },
  });
  if (error || !data) throw toApiError(error, response);
  return data;
}

/**
 * Read a single item by id. Pass a reactive accessor so the query re-runs when
 * the id changes; an empty id leaves the query disabled.
 */
export function useItem(id: Accessor<string>) {
  return useQuery(() => {
    const currentId = id().trim();
    return {
      queryKey: queryKeys.items.detail(currentId),
      queryFn: () => fetchItem(currentId),
      enabled: currentId.length > 0,
    };
  });
}

/** Create or replace an item, then seed the detail cache with the result. */
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (input: NewItem): Promise<Item> => {
      const { data, error, response } = await apiClient.POST("/items", {
        body: input,
      });
      if (error || !data) throw toApiError(error, response);
      return data;
    },
    onSuccess: (item) => {
      // The POST response is authoritative, so prime the cache: a subsequent
      // lookup of this id resolves instantly from cache.
      queryClient.setQueryData<Item>(queryKeys.items.detail(item.id), item);
    },
  }));
}
