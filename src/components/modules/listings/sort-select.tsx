"use client";

import { NativeSelect } from "@/components/ui/native-select";
import { useUrlState } from "@/hooks";

export interface SortOption {
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Sort dropdown that writes sortBy + sortOrder to the URL
export default function SortSelect({ options }: { options: SortOption[] }) {
  const { get, set } = useUrlState();
  const current =
    options.find(
      (option) =>
        option.sortBy === get("sortBy") &&
        option.sortOrder === get("sortOrder"),
    ) ?? options[0];

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <label
        htmlFor="sort-results"
        className="hidden whitespace-nowrap sm:inline"
      >
        Sort by
      </label>
      <NativeSelect
        id="sort-results"
        aria-label="Sort results"
        value={`${current.sortBy}:${current.sortOrder}`}
        onChange={(event) => {
          const [sortBy, sortOrder] = event.target.value.split(":");
          set({ sortBy, sortOrder });
        }}
        className="h-10 w-auto min-w-44 text-foreground"
      >
        {options.map((option) => (
          <option
            key={`${option.sortBy}:${option.sortOrder}`}
            value={`${option.sortBy}:${option.sortOrder}`}
          >
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
