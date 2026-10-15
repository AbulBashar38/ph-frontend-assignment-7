import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useNavigationStore } from "@/store/navigation.store";

// Read and write query-string state (filters, sort, page) so every view can be bookmarked or shared.
// Changing a filter resets to page 1; empty values are removed from the URL.
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? "";

  const set = (
    updates: Record<string, string | null | undefined>,
    { resetPage = true }: { resetPage?: boolean } = {},
  ) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (resetPage) next.delete("page");

    const query = next.toString();
    if (query === searchParams.toString()) return;

    useNavigationStore.getState().setUpdating(true);
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const clear = (keys: string[]) =>
    set(Object.fromEntries(keys.map((key) => [key, null])));

  return { get, set, clear, isPending, searchParams };
}
