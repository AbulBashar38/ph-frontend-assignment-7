import { toPageSize } from "@/utils";
import { useUrlState } from "./url-state.hook";

// Items per page for a dashboard list: ?limit in the URL, or the list's default
export function usePageSize(defaultSize: number) {
  const { get } = useUrlState();
  return toPageSize(get("limit") || undefined, defaultSize);
}
