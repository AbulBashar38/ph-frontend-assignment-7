import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createRoommateProfile,
  getMyRoommateProfile,
  getRoommateConnections,
  getRoommateMatches,
  getRoommateProfile,
  getRoommateRequests,
  sendRoommateRequest,
  updateRoommateProfile,
  updateRoommateRequestStatus,
  updateRoommateSearch,
} from "@/api";
import { patchListItem } from "@/lib/optimistic";
import type {
  MyRoommateProfile,
  QueryParams,
  RoommateMatchQueryParams,
  RoommateProfilePayload,
  RoommateRequest,
  RoommateRequestQueryParams,
  RoommateRequestStatus,
} from "@/types";
import { getErrorStatus } from "@/utils";

const MY_PROFILE_KEY = ["roommate-profile", "me"];
// Everything that depends on the tenant's own profile or connections
const ROOMMATE_KEYS = [
  ["roommate-profile"],
  ["roommate-matches"],
  ["roommate-requests"],
  ["roommate-connections"],
];

function useInvalidateRoommates() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      ROOMMATE_KEYS.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
}

// null when the tenant hasn't created a roommate profile yet (the API answers 404)
export function useMyRoommateProfile() {
  return useQuery({
    queryKey: MY_PROFILE_KEY,
    queryFn: async () => {
      try {
        return (await getMyRoommateProfile()).data;
      } catch (error) {
        if (getErrorStatus(error) === 404) return null;
        throw error;
      }
    },
  });
}

// Creates the profile the first time, updates it afterwards
export function useSaveRoommateProfile(exists: boolean) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRoommates();
  return useMutation({
    mutationFn: (payload: RoommateProfilePayload) =>
      exists ? updateRoommateProfile(payload) : createRoommateProfile(payload),
    onSuccess: async () => {
      await invalidate();
      // Gender and occupation are saved on the account too
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Optimistic: the switch flips at once and rolls back if the API refuses
export function useToggleRoommateSearch() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRoommates();
  return useMutation({
    mutationFn: updateRoommateSearch,
    onMutate: async (isActive) => {
      await queryClient.cancelQueries({ queryKey: MY_PROFILE_KEY });
      const previous = queryClient.getQueryData<MyRoommateProfile | null>(
        MY_PROFILE_KEY,
      );
      if (previous) {
        queryClient.setQueryData(MY_PROFILE_KEY, { ...previous, isActive });
      }
      return { previous };
    },
    onError: (_error, _isActive, context) =>
      queryClient.setQueryData(MY_PROFILE_KEY, context?.previous),
    onSettled: invalidate,
  });
}

export function useRoommateMatches(params: RoommateMatchQueryParams) {
  return useQuery({
    queryKey: ["roommate-matches", params],
    queryFn: () => getRoommateMatches(params),
    placeholderData: keepPreviousData,
  });
}

export function useRoommateProfile(id: string) {
  return useQuery({
    queryKey: ["roommate-profile", id],
    queryFn: () => getRoommateProfile(id),
  });
}

export function useSendRoommateRequest() {
  const invalidate = useInvalidateRoommates();
  return useMutation({
    mutationFn: sendRoommateRequest,
    onSuccess: invalidate,
  });
}

export function useRoommateRequests(
  params: RoommateRequestQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["roommate-requests", params],
    queryFn: () => getRoommateRequests(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

// Optimistic like the other status changes
export function useUpdateRoommateRequestStatus() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRoommates();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Exclude<RoommateRequestStatus, "PENDING">;
    }) => updateRoommateRequestStatus(id, status),
    onMutate: async ({ id, status }) => ({
      undo: await patchListItem<RoommateRequest>(
        queryClient,
        ["roommate-requests"],
        id,
        { status },
      ),
    }),
    onError: (_error, _variables, context) => context?.undo(),
    onSettled: invalidate,
  });
}

export function useRoommateConnections(
  params: QueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["roommate-connections", params],
    queryFn: () => getRoommateConnections(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}
