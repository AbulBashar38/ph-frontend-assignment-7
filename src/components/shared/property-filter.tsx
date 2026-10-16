"use client";

import { useAuth, useManagedProperties } from "@/hooks";
import UrlSelect from "./url-select";

// Owners can narrow a list to one of their listings (?propertyId); others don't see it
export default function PropertyFilter() {
  const { isOwner } = useAuth();
  const properties = useManagedProperties({ limit: 100 }, { enabled: isOwner });

  if (!isOwner) return null;

  return (
    <UrlSelect
      urlKey="propertyId"
      label="Filter by property"
      className="sm:w-60"
      options={[
        { value: "", label: "All properties" },
        ...(properties.data?.data ?? []).map((property) => ({
          value: property.id,
          label: property.title,
        })),
      ]}
    />
  );
}
