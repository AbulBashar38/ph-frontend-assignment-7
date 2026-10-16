import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";

// Optimistically patch one item in every cached list under `queryKey`; returns a function that undoes it
export async function patchListItem<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  id: string,
  patch: Partial<T>,
) {
  await queryClient.cancelQueries({ queryKey });
  const previous = queryClient.getQueriesData<ApiResponse<T[]>>({ queryKey });
  queryClient.setQueriesData<ApiResponse<T[]>>(
    { queryKey },
    (old) =>
      old && {
        ...old,
        data: old.data.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      },
  );
  return () => {
    for (const [key, data] of previous) queryClient.setQueryData(key, data);
  };
}
