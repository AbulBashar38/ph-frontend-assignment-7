import { cacheLife } from "next/cache";
import type { Property } from "@/types";
import { getPublicProperties } from "./property.api";

interface FeaturedProperties {
  properties: Property[];
  total: number;
}

// Server-only: cached for a few minutes so the landing page stays fast and never blocks on the API
export async function getFeaturedProperties(
  limit = 6,
): Promise<FeaturedProperties> {
  "use cache";
  cacheLife("minutes");

  try {
    const res = await getPublicProperties({ limit, sortBy: "newest" });
    return { properties: res.data, total: res.meta?.total ?? res.data.length };
  } catch {
    // The page still renders (with empty states) if the backend is unreachable
    return { properties: [], total: 0 };
  }
}
