"use client";

import { Search } from "lucide-react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUrlState } from "@/hooks";
import { cn } from "@/lib/utils";

// A text box bound to a URL parameter; writes a moment after the user stops typing (resets ?page)
export default function SearchInput({
  urlKey = "searchTerm",
  withIcon = true,
  className,
  ...props
}: {
  urlKey?: string;
  withIcon?: boolean;
} & Omit<ComponentProps<typeof Input>, "value" | "onChange">) {
  const { get, set } = useUrlState();
  const urlValue = get(urlKey);
  const [value, setValue] = useState(urlValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Always commit with the latest URL state, even if other filters changed while typing
  const setLatest = useRef(set);

  useEffect(() => {
    setLatest.current = set;
  });

  // Follow the URL when it changes elsewhere (back button, "Clear all", a link)
  useEffect(() => setValue(urlValue), [urlValue]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const input = (
    <Input
      {...props}
      className={cn(withIcon && "pl-10", className)}
      value={value}
      onChange={(event) => {
        const next = event.target.value;
        setValue(next);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(
          () => setLatest.current({ [urlKey]: next.trim() }),
          400,
        );
      }}
    />
  );

  if (!withIcon) return input;

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      {input}
    </div>
  );
}
