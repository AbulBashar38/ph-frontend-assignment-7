import type { SortOrder } from "@/types";
import { toPositiveInt } from "@/utils";
import { useUrlState } from "./url-state.hook";

export type SortOptions = Record<
  string,
  { sortBy: string; sortOrder: SortOrder }
>;

// The URL params every dashboard list shares: ?status, ?propertyId, ?sort and ?page (unknown values are ignored)
export function useListParams<TStatus extends string>({
  statuses,
  sorts,
}: {
  statuses: readonly TStatus[];
  // "" is the default sort
  sorts: SortOptions;
}) {
  const { get } = useUrlState();
  const rawStatus = get("status");
  const status = (statuses as readonly string[]).includes(rawStatus)
    ? (rawStatus as TStatus)
    : undefined;
  const propertyId = get("propertyId") || undefined;
  const sort = sorts[get("sort")] ?? sorts[""];

  return {
    status,
    propertyId,
    page: toPositiveInt(get("page"), 1),
    ...sort,
    filtered: Boolean(status || propertyId),
  };
}
