import { useQuery } from "@tanstack/react-query";
import { getPublicProperties, getPublicPropertyById } from "@/api";
import type { PublicPropertyQueryParams } from "@/types";

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
