import { useQueries, useQuery } from "@tanstack/react-query";
import { getPublicProperties, getPublicPropertyById } from "@/api";
import type { PublicPropertyQueryParams } from "@/types";
import { getErrorStatus } from "@/utils";

export function usePublicProperties(params?: PublicPropertyQueryParams) {
  return useQuery({
    queryKey: ["public-properties", params],
    queryFn: () => getPublicProperties(params),
  });
}

export function usePublicProperty(id: string) {
  return useQuery({
    queryKey: ["public-property", id],
    queryFn: () => getPublicPropertyById(id),
    enabled: Boolean(id),
  });
}

// Fresh public data for each shortlisted property; a removed or unpublished one comes back as null
export function useShortlistProperties(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["public-property", id],
      queryFn: async () => {
        try {
          return (await getPublicPropertyById(id)).data;
        } catch (error) {
          if (getErrorStatus(error) === 404) return null;
          throw error;
        }
      },
    })),
  });
}
