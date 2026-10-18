"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUrlState } from "@/hooks";
import { MAX_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/utils";

// "Per page" combobox: type any number from 1 to 100, or open the list of common sizes.
// Writes ?limit and goes back to page 1.
export default function PageSizeInput({ value }: { value: number }) {
  const { set } = useUrlState();
  const listId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
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

  const openList = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    try {
      // Opens the suggestions (Chromium, Firefox); Safari just keeps the focus
      input.showPicker();
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <label htmlFor={inputId} className="whitespace-nowrap">
        Per page
      </label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={inputId}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          list={listId}
          value={draft}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, "");
            setDraft(next);
            // Picking one of the suggestions applies it straight away
            if (PAGE_SIZE_OPTIONS.includes(Number(next))) commit(next);
          }}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit(event.currentTarget.value);
          }}
          className="h-10 w-24 pr-9 text-foreground [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onMouseDown={(event) => event.preventDefault()}
          onClick={openList}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
      <datalist id={listId}>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size} />
        ))}
      </datalist>
    </div>
  );
}
