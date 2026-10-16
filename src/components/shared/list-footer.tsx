"use client";

import { useUrlState } from "@/hooks";
import type { Meta } from "@/types";
import UrlPagination from "./url-pagination";

// "12 requests" and the page links under a dashboard list
export default function ListFooter({
  meta,
  pathname,
  noun,
}: {
  meta: Meta | undefined;
  pathname: string;
  noun: [singular: string, plural: string];
}) {
  const { searchParams } = useUrlState();
  if (!meta || meta.total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {meta.total} {meta.total === 1 ? noun[0] : noun[1]}
      </p>
      <UrlPagination
        pathname={pathname}
        params={Object.fromEntries(searchParams.entries())}
        page={meta.page}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
