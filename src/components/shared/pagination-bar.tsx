import type { ReactNode } from "react";
import type { Meta } from "@/types";
import PageSizeInput from "./page-size-input";
import UrlPagination from "./url-pagination";

// Under a list: how many there are, how many per page, and the page links (works in server pages too)
export default function PaginationBar({
  meta,
  pathname,
  params,
  summary,
}: {
  meta: Meta;
  pathname: string;
  params: Record<string, string | undefined>;
  summary: ReactNode;
}) {
  if (meta.total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <p className="text-sm text-muted-foreground">{summary}</p>
        <PageSizeInput value={meta.limit} />
      </div>
      <UrlPagination
        pathname={pathname}
        params={params}
        page={meta.page}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
