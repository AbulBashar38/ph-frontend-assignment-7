"use client";

import { Receipt } from "lucide-react";
import type { DataTableColumn } from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilteredEmptyState from "@/components/shared/filtered-empty-state";
import ListToolbar from "@/components/shared/list-toolbar";
import ListView from "@/components/shared/list-view";
import PersonCell from "@/components/shared/person-cell";
import PropertyFilter from "@/components/shared/property-filter";
import StatusBadge from "@/components/shared/status-badge";
import UrlSelect from "@/components/shared/url-select";
import UrlTabs from "@/components/shared/url-tabs";
import {
  type SortOptions,
  useAuth,
  useListParams,
  usePageSize,
  usePayments,
} from "@/hooks";
import type { Payment, PaymentStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import ReceiptButton from "./receipt-button";
import TenantPaymentActions from "./tenant-payment-actions";

const PAGE_SIZE = 10;

const STATUS_TABS: { value: "" | PaymentStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Due" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];
const STATUSES = STATUS_TABS.map((tab) => tab.value).filter(
  (value): value is PaymentStatus => value !== "",
);

const SORTS: SortOptions = {
  "": { sortBy: "dueDate", sortOrder: "desc" },
  "due-soon": { sortBy: "dueDate", sortOrder: "asc" },
  paid: { sortBy: "paidAt", sortOrder: "desc" },
  amount: { sortBy: "amount", sortOrder: "desc" },
};

function columns(isTenant: boolean): DataTableColumn<Payment>[] {
  return [
    {
      key: "person",
      header: isTenant ? "Owner" : "Tenant",
      cell: (payment) => {
        const person = isTenant ? payment.rental.owner : payment.tenant;
        return (
          <PersonCell
            name={person.name}
            imageUrl={person.imageUrl}
            detail={person.phone ?? undefined}
          />
        );
      },
    },
    {
      key: "bill",
      header: "Bill",
      className: "whitespace-normal",
      cell: (payment) => (
        <div className="min-w-44">
          <p className="line-clamp-1 font-medium">
            {payment.rental.room.name} · month {payment.periodNumber}
          </p>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {payment.rental.property.title}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {formatDate(payment.periodStart)} – {formatDate(payment.periodEnd)}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (payment) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(payment.amount)}
        </span>
      ),
    },
    {
      key: "date",
      header: "Due / paid",
      responsive: "hidden md:table-cell",
      cell: (payment) =>
        payment.paidAt ? (
          <div>
            <p className="tabular-nums">{formatDate(payment.paidAt)}</p>
            <p className="text-xs text-muted-foreground">paid</p>
          </div>
        ) : (
          <div>
            <p className="tabular-nums">{formatDate(payment.dueDate)}</p>
            <p className="text-xs text-muted-foreground">due</p>
          </div>
        ),
    },
    {
      key: "status",
      header: "Status",
      className: "whitespace-normal",
      cell: (payment) => (
        <div className="space-y-1">
          <StatusBadge status={payment.status} />
          {payment.failureReason && (
            <p className="line-clamp-2 max-w-48 text-xs text-destructive">
              {payment.failureReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (payment) =>
        isTenant ? (
          <TenantPaymentActions payment={payment} />
        ) : payment.status === "PAID" ? (
          <ReceiptButton payment={payment} />
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
  ];
}

// Rent bills of the signed-in user: tenants can pay due ones, everyone gets receipts for paid ones
export default function PaymentTable({ pathname }: { pathname: string }) {
  const pageSize = usePageSize(PAGE_SIZE);
  const { isTenant } = useAuth();
  const { filtered, ...params } = useListParams({
    statuses: STATUSES,
    sorts: SORTS,
  });
  const query = usePayments(
    { ...params, limit: pageSize },
    { keepPrevious: true },
  );

  return (
    <ListView
      query={query}
      pathname={pathname}
      noun={["payment", "payments"]}
      columns={columns(isTenant)}
      getRowId={(payment) => payment.id}
      toolbar={
        <ListToolbar
          tabs={<UrlTabs label="Filter by status" options={STATUS_TABS} />}
        >
          <PropertyFilter />
          <UrlSelect
            urlKey="sort"
            label="Sort"
            className="sm:w-48"
            options={[
              { value: "", label: "Latest due date" },
              { value: "due-soon", label: "Due soonest" },
              { value: "paid", label: "Recently paid" },
              { value: "amount", label: "Highest amount" },
            ]}
          />
        </ListToolbar>
      }
      empty={
        filtered ? (
          <FilteredEmptyState noun="payments" keys={["status", "propertyId"]} />
        ) : (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            description={
              isTenant
                ? "Your monthly rent bills appear here once a rental starts."
                : "Rent bills appear here once a tenant's rental starts."
            }
          />
        )
      }
    />
  );
}
