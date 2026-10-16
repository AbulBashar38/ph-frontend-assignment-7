"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlState } from "@/hooks";

// Tabs whose selection lives in the URL (?status=…), so filtered views can be bookmarked; "" means all
export default function UrlTabs({
  urlKey = "status",
  options,
  label,
}: {
  urlKey?: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  const { get, set } = useUrlState();

  return (
    <Tabs
      value={get(urlKey)}
      onValueChange={(value: string) => set({ [urlKey]: value })}
    >
      <TabsList aria-label={label} scroll>
        {options.map((option) => (
          <TabsTrigger key={option.value || "all"} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
