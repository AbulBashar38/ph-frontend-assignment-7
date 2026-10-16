"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { ApiResponse } from "@/types";
import DataTable, { type DataTableColumn } from "./data-table";
import ListFooter from "./list-footer";
import QueryError from "./query-error";
import TableSkeleton from "./table-skeleton";

// A dashboard list from start to finish: toolbar, skeleton, error with retry, table or empty state, paging
export default function ListView<T>({
  query,
  toolbar,
  columns,
  getRowId,
  empty,
  pathname,
  noun,
}: {
  query: UseQueryResult<ApiResponse<T[]>>;
  toolbar: ReactNode;
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  empty: ReactNode;
  pathname: string;
  noun: [singular: string, plural: string];
}) {
  if (query.isPending) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {toolbar}
      {query.isError ? (
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      ) : (
        <>
          {/* Dimmed while the next page or filter loads */}
          <div
            className={
              query.isPlaceholderData ? "opacity-60 transition-opacity" : ""
            }
          >
            <DataTable
              columns={columns}
              rows={query.data.data}
              getRowId={getRowId}
              empty={empty}
            />
          </div>
          <ListFooter meta={query.data.meta} pathname={pathname} noun={noun} />
        </>
      )}
    </div>
  );
}
