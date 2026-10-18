"use client";

import { useUrlState } from "@/hooks";
import type { Meta } from "@/types";
import PaginationBar from "./pagination-bar";

// "12 requests", the per-page box and the page links under a dashboard list
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
  if (!meta) return null;

  return (
    <PaginationBar
      meta={meta}
      pathname={pathname}
      params={Object.fromEntries(searchParams.entries())}
      summary={`${meta.total} ${meta.total === 1 ? noun[0] : noun[1]}`}
    />
  );
}
