import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createViewing, updateViewingStatus } from "@/api";
import { patchListItem } from "@/lib/optimistic";
import type { ViewingListItem, ViewingStatusPayload } from "@/types";

export function useCreateViewing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createViewing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewings"] });
    },
  });
}

// Optimistic: the row shows its new status (and new time) before the server answers
export function useUpdateViewingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ViewingStatusPayload;
    }) => updateViewingStatus(id, payload),
    onMutate: async ({ id, payload }) => ({
      undo: await patchListItem<ViewingListItem>(
        queryClient,
        ["viewings"],
        id,
        {
          status: payload.status,
          ...(payload.status === "RESCHEDULED"
            ? { scheduledAt: payload.scheduledAt }
            : {}),
        },
      ),
    }),
    onError: (_error, _variables, context) => context?.undo(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["viewings"] }),
  });
}
