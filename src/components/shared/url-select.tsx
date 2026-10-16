"use client";

import { NativeSelect } from "@/components/ui/native-select";
import { useUrlState } from "@/hooks";

// A dropdown bound to one URL parameter (a filter or the sort order); "" removes it
export default function UrlSelect({
  urlKey,
  label,
  options,
  className,
}: {
  urlKey: string;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const { get, set } = useUrlState();

  return (
    <NativeSelect
      aria-label={label}
      value={get(urlKey)}
      onChange={(event) => set({ [urlKey]: event.target.value })}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value || "all"} value={option.value}>
          {option.label}
        </option>
      ))}
    </NativeSelect>
  );
}
