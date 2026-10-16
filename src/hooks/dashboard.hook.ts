import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getApplications,
  getManagedProperties,
  getManagedRooms,
  getPayments,
  getPlatformStats,
  getRentals,
  getViewings,
} from "@/api";
import type {
  ApplicationQueryParams,
  ManagedPropertyQueryParams,
  ManagedRoomQueryParams,
  PaymentQueryParams,
  RentalQueryParams,
  ViewingQueryParams,
} from "@/types";

export interface ListQueryOptions {
  // Keep showing the current page while the next page or filter loads
  keepPrevious?: boolean;
  enabled?: boolean;
}

const listOptions = (options?: ListQueryOptions) => ({
  enabled: options?.enabled,
  placeholderData: options?.keepPrevious ? keepPreviousData : undefined,
});

export function useApplications(
  params?: ApplicationQueryParams,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => getApplications(params),
    ...listOptions(options),
  });
}

export function useViewings(
  params?: ViewingQueryParams,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: ["viewings", params],
    queryFn: () => getViewings(params),
    ...listOptions(options),
  });
}

export function useRentals(
  params?: RentalQueryParams,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: ["rentals", params],
    queryFn: () => getRentals(params),
    ...listOptions(options),
  });
}

export function usePayments(
  params?: PaymentQueryParams,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
    ...listOptions(options),
  });
}

export function useManagedProperties(
  params?: ManagedPropertyQueryParams,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: ["managed-properties", params],
    queryFn: () => getManagedProperties(params),
    ...listOptions(options),
  });
}

export function useManagedRooms(
  params?: ManagedRoomQueryParams,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: ["managed-rooms", params],
    queryFn: () => getManagedRooms(params),
    ...listOptions(options),
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });
}
