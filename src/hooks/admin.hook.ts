import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createAdmin, getAuditLogs, getUsers, updateUserStatus } from "@/api";
import { patchListItem } from "@/lib/optimistic";
import type {
  AuditQueryParams,
  User,
  UserQueryParams,
  UserStatusPayload,
} from "@/types";

export function useUsers(params: UserQueryParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}

// Optimistic block / activate; the platform stats change with it
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserStatusPayload }) =>
      updateUserStatus(id, payload),
    onMutate: async ({ id, payload }) => ({
      undo: await patchListItem<User>(queryClient, ["users"], id, {
        status: payload.status,
        blockedReason: payload.status === "BLOCKED" ? payload.reason : null,
      }),
    }),
    onError: (_error, _variables, context) => context?.undo(),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["platform-stats"] }),
      ]),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useAuditLogs(params: AuditQueryParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
    placeholderData: keepPreviousData,
  });
}
