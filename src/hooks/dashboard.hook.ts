import { useQuery } from "@tanstack/react-query";
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

export function useApplications(params?: ApplicationQueryParams) {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => getApplications(params),
  });
}

export function useViewings(params?: ViewingQueryParams) {
  return useQuery({
    queryKey: ["viewings", params],
    queryFn: () => getViewings(params),
  });
}

export function useRentals(params?: RentalQueryParams) {
  return useQuery({
    queryKey: ["rentals", params],
    queryFn: () => getRentals(params),
  });
}

export function usePayments(params?: PaymentQueryParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
  });
}

export function useManagedProperties(params?: ManagedPropertyQueryParams) {
  return useQuery({
    queryKey: ["managed-properties", params],
    queryFn: () => getManagedProperties(params),
  });
}

export function useManagedRooms(params?: ManagedRoomQueryParams) {
  return useQuery({
    queryKey: ["managed-rooms", params],
    queryFn: () => getManagedRooms(params),
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });
}
