import { format } from "date-fns";

// Taka with South Asian digit grouping: ৳1,50,000
const amountFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return `৳${amountFormatter.format(amount)}`;
}

export function formatDate(value: string | Date, pattern = "dd MMM yyyy") {
  return format(new Date(value), pattern);
}

export function formatDateTime(value: string | Date) {
  return format(new Date(value), "dd MMM yyyy, h:mm a");
}

// "SECURITY_GUARD" → "Security Guard"
export function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
