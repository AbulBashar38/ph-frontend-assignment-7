import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApplication, updateApplicationStatus } from "@/api";
import { patchListItem } from "@/lib/optimistic";
import type { ApplicationListItem, ApplicationStatusPayload } from "@/types";

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

// Approving reserves the room and opens a rental, so those caches refresh too
const AFFECTED_KEYS = [
  ["applications"],
  ["rentals"],
  ["payments"],
  ["managed-rooms"],
  ["managed-properties"],
  ["managed-property"],
];

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ApplicationStatusPayload;
    }) => updateApplicationStatus(id, payload),
    onMutate: async ({ id, payload }) => ({
      undo: await patchListItem<ApplicationListItem>(
        queryClient,
        ["applications"],
        id,
        { status: payload.status },
      ),
    }),
    onError: (_error, _variables, context) => context?.undo(),
    onSettled: () =>
      Promise.all(
        AFFECTED_KEYS.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      ),
  });
}
