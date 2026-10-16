import type { Meta } from "@/types";
import SortSelect, { type SortOption } from "./sort-select";

// "Showing 1–12 of 40 rooms" + the sort dropdown, above any search results
export default function ResultsHeader({
  meta,
  noun,
  sortOptions,
}: {
  meta: Meta;
  noun: [singular: string, plural: string];
  sortOptions: SortOption[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {meta.total > 0 ? (
          <>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>{" "}
            {meta.total === 1 ? noun[0] : noun[1]}
          </>
        ) : (
          `No ${noun[1]} found`
        )}
      </p>
      <SortSelect options={sortOptions} />
    </div>
  );
}
