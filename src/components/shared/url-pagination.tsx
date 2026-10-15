import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Page numbers to show: first, last, the current page and its neighbours, with gaps as "…"
function pageWindow(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const withGaps: (number | "gap")[] = [];
  for (const page of sorted) {
    const previous = withGaps.at(-1);
    if (typeof previous === "number" && page - previous > 1) {
      withGaps.push("gap");
    }
    withGaps.push(page);
  }
  return withGaps;
}

// Server-rendered pagination made of plain links that keep the current filters (?page=N)
export default function UrlPagination({
  pathname,
  params,
  page,
  totalPages,
}: {
  pathname: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value && key !== "page") query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const arrow = (target: number, label: string, icon: React.ReactNode) =>
    target < 1 || target > totalPages ? (
      <span
        aria-disabled="true"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "pointer-events-none opacity-40",
        )}
      >
        {icon}
      </span>
    ) : (
      <Link
        href={hrefFor(target)}
        aria-label={label}
        scroll={false}
        className={buttonVariants({ variant: "outline", size: "icon-sm" })}
      >
        {icon}
      </Link>
    );

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2"
    >
      {arrow(page - 1, "Previous page", <ChevronLeft />)}
      {pageWindow(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span
            // Gaps have no identity of their own; their position is stable for a given page
            // biome-ignore lint/suspicious/noArrayIndexKey: see above
            key={`gap-${index}`}
            className="px-1 text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            scroll={false}
            aria-current={item === page ? "page" : undefined}
            className={buttonVariants({
              variant: item === page ? "default" : "ghost",
              size: "icon-sm",
            })}
          >
            {item}
          </Link>
        ),
      )}
      {arrow(page + 1, "Next page", <ChevronRight />)}
    </nav>
  );
}
