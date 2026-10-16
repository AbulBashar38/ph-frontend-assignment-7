import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaymentReceipt, updateRentalStatus } from "@/api";
import { patchListItem } from "@/lib/optimistic";
import type { Rental, RentalStatusPayload } from "@/types";

// Ending a rental frees the room and voids unpaid bills, so those caches refresh too
const AFFECTED_KEYS = [
  ["rentals"],
  ["payments"],
  ["managed-rooms"],
  ["managed-properties"],
  ["managed-property"],
];

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RentalStatusPayload;
    }) => updateRentalStatus(id, payload),
    onMutate: async ({ id, payload }) => ({
      undo: await patchListItem<Rental>(queryClient, ["rentals"], id, {
        status: payload.status,
      }),
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

// Fetches the PDF and hands it to the browser as a download
export function useDownloadReceipt() {
  return useMutation({
    mutationFn: async ({ id, filename }: { id: string; filename: string }) => {
      const blob = await getPaymentReceipt(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
  });
}
