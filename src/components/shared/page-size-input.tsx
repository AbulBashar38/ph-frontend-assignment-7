"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUrlState } from "@/hooks";
import { MAX_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/utils";

// "Per page": an editable number with a fixed menu of common sizes beside it.
// Picking a size fills the box and applies it; the box can still be edited (1–100). Writes ?limit, back to page 1.
export default function PageSizeInput({ value }: { value: number }) {
  const { set } = useUrlState();
  const inputId = useId();
  const [draft, setDraft] = useState(String(value));

  // Follow the URL when it changes elsewhere (back button, a link)
  useEffect(() => setDraft(String(value)), [value]);

  const commit = (raw: string) => {
    const size = Number(raw);
    if (!Number.isInteger(size) || size < 1) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(size, MAX_PAGE_SIZE);
    setDraft(String(clamped));
    if (clamped !== value) set({ limit: String(clamped) });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <label htmlFor={inputId} className="whitespace-nowrap">
        Per page
      </label>
      <div className="flex h-10 items-stretch overflow-hidden rounded-lg border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Input
          id={inputId}
          inputMode="numeric"
          maxLength={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit(event.currentTarget.value);
          }}
          className="h-full w-14 rounded-none border-0 px-3 text-foreground shadow-none focus-visible:ring-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Choose items per page"
            className="flex w-9 items-center justify-center border-l text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:bg-muted data-popup-open:bg-muted"
          >
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-28">
            <DropdownMenuRadioGroup
              value={String(value)}
              onValueChange={(next) => commit(String(next))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <DropdownMenuRadioItem
                  key={size}
                  value={String(size)}
                  closeOnClick
                  className="h-9"
                >
                  {size}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
