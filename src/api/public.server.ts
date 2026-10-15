import { cacheLife } from "next/cache";
import { FetchError } from "ofetch";
import type {
  Meta,
  Property,
  PublicPropertyQueryParams,
  PublicRoomQueryParams,
  Room,
} from "@/types";
import { getPublicProperties, getPublicPropertyById } from "./property.api";
import { getPublicRoomById, getPublicRooms } from "./room.api";

// Server-only, cached reads of public data. Lists stay fast and the pages still render (with empty states)
// if the backend is unreachable; a missing record returns null so the page can show "not found".

interface FeaturedProperties {
  properties: Property[];
  total: number;
}

export interface Paginated<T> {
  items: T[];
  meta: Meta;
}

const emptyPage = <T>(limit: number): Paginated<T> => ({
  items: [],
  meta: { page: 1, limit, total: 0, totalPages: 0 },
});

const isNotFound = (error: unknown) =>
  error instanceof FetchError &&
  (error.statusCode === 404 || error.statusCode === 400);

export async function getFeaturedProperties(
  limit = 6,
): Promise<FeaturedProperties> {
  "use cache";
  cacheLife("minutes");

  try {
    const res = await getPublicProperties({ limit, sortBy: "newest" });
    return { properties: res.data, total: res.meta?.total ?? res.data.length };
  } catch {
    return { properties: [], total: 0 };
  }
}

export async function searchProperties(
  params: PublicPropertyQueryParams,
): Promise<Paginated<Property>> {
  "use cache";
  cacheLife("minutes");

  const res = await getPublicProperties(params);
  return {
    items: res.data,
    meta: res.meta ?? emptyPage<Property>(params.limit ?? 12).meta,
  };
}

export async function getPropertyDetail(id: string): Promise<Property | null> {
  "use cache";
  cacheLife("minutes");

  try {
    return (await getPublicPropertyById(id)).data;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function searchRooms(
  params: PublicRoomQueryParams,
): Promise<Paginated<Room>> {
  "use cache";
  cacheLife("minutes");

  const res = await getPublicRooms(params);
  return {
    items: res.data,
    meta: res.meta ?? emptyPage<Room>(params.limit ?? 12).meta,
  };
}

export async function getRoomDetail(id: string): Promise<Room | null> {
  "use cache";
  cacheLife("minutes");

  try {
    return (await getPublicRoomById(id)).data;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}
