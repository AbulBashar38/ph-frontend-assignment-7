import type { Payment } from "@/types";
import { formatCurrency, formatDate, formatDateTime } from "@/utils";

// What was (or wasn't) paid: the bill's room, period and amount
export default function BillSummary({ payment }: { payment: Payment }) {
  const rows = [
    ["Room", `${payment.rental.room.name}, ${payment.rental.property.title}`],
    [
      "Period",
      `Month ${payment.periodNumber} · ${formatDate(payment.periodStart)} – ${formatDate(payment.periodEnd)}`,
    ],
    ["Owner", payment.rental.owner.name],
    ...(payment.paidAt ? [["Paid", formatDateTime(payment.paidAt)]] : []),
  ];

  return (
    <div className="w-full rounded-2xl border bg-muted/30 p-5 text-left">
      <div className="flex items-baseline justify-between gap-3 border-b pb-4">
        <span className="text-sm text-muted-foreground">Amount</span>
        <span className="font-heading text-2xl font-bold tabular-nums">
          {formatCurrency(payment.amount)}
        </span>
      </div>
      <dl className="mt-4 space-y-2.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
