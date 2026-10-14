"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchTarget = "properties" | "rooms";

const PROPERTY_TYPES = [
  ["", "Any type"],
  ["APARTMENT", "Apartment"],
  ["HOUSE", "House"],
  ["SUBLET", "Sublet"],
  ["HOSTEL", "Hostel"],
  ["STUDIO", "Studio"],
] as const;

const ROOM_TYPES = [
  ["", "Any room"],
  ["SINGLE", "Single"],
  ["SHARED", "Shared"],
  ["MASTER", "Master"],
  ["STUDIO", "Studio"],
] as const;

const BUDGETS = [
  ["", "Any budget"],
  ["8000", "Up to ৳8,000"],
  ["12000", "Up to ৳12,000"],
  ["18000", "Up to ৳18,000"],
  ["25000", "Up to ৳25,000"],
  ["40000", "Up to ৳40,000"],
] as const;

const POPULAR_AREAS = [
  "Mirpur",
  "Dhanmondi",
  "Uttara",
  "Bashundhara",
  "Banani",
];

const fieldClass =
  "h-11 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/80 focus-visible:ring-0";

export default function HeroSearch() {
  const router = useRouter();
  const [target, setTarget] = useState<SearchTarget>("properties");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const types = target === "properties" ? PROPERTY_TYPES : ROOM_TYPES;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (location.trim()) params.set("searchTerm", location.trim());
    if (type) {
      params.set(target === "properties" ? "propertyType" : "roomType", type);
    }
    if (maxRent) params.set("maxRent", maxRent);

    const query = params.toString();
    router.push(`/${target}${query ? `?${query}` : ""}`);
  };

  const switchTarget = (next: SearchTarget) => {
    setTarget(next);
    setType("");
  };

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="What are you looking for?"
        className="mb-3 inline-flex rounded-full border bg-card/80 p-1 text-sm shadow-xs backdrop-blur"
      >
        {(
          [
            ["properties", "Whole homes"],
            ["rooms", "Rooms & shares"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={target === value}
            onClick={() => switchTarget(value)}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium transition-colors",
              target === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-1 rounded-2xl border bg-card p-2 shadow-xl shadow-primary/5 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center sm:gap-0 sm:rounded-full sm:pl-6"
      >
        <label className="flex flex-col px-3 pt-1 sm:px-0 sm:pr-4">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Where
          </span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Area, city or street"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col border-t px-3 pt-1 sm:border-t-0 sm:border-l sm:px-4">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Type
          </span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={cn(fieldClass, "cursor-pointer")}
          >
            {types.map(([value, label]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col border-t px-3 pt-1 sm:border-t-0 sm:border-l sm:px-4">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Budget
          </span>
          <select
            value={maxRent}
            onChange={(event) => setMaxRent(event.target.value)}
            className={cn(fieldClass, "cursor-pointer")}
          >
            {BUDGETS.map(([value, label]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <Button
          type="submit"
          size="lg"
          className="mt-1 h-12 gap-2 rounded-xl px-6 text-sm font-semibold sm:mt-0 sm:rounded-full"
        >
          <Search className="size-4" />
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Popular:</span>
        {POPULAR_AREAS.map((area) => (
          <Link
            key={area}
            href={`/${target}?area=${encodeURIComponent(area)}`}
            className="rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
          >
            {area}
          </Link>
        ))}
      </div>
    </div>
  );
}
