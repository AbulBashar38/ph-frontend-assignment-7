import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  archiveProperty,
  archiveRoom,
  createProperty,
  createRoom,
  deletePropertyImage,
  deleteRoomImage,
  getManagedPropertyById,
  updateProperty,
  updatePropertyStatus,
  updateRoom,
  updateRoomStatus,
} from "@/api";
import type {
  ApiResponse,
  ManagedProperty,
  ManualPropertyStatus,
  ManualRoomStatus,
  PropertyPayload,
  RoomPayload,
} from "@/types";

// Every cached view of listings or rooms that a change can affect
const LISTING_KEYS = [
  ["managed-properties"],
  ["managed-property"],
  ["managed-rooms"],
  ["public-properties"],
];

function useInvalidateListings() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      LISTING_KEYS.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
}

export function useManagedProperty(id: string) {
  return useQuery({
    queryKey: ["managed-property", id],
    queryFn: () => getManagedPropertyById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProperty() {
  const invalidate = useInvalidateListings();
  return useMutation({ mutationFn: createProperty, onSuccess: invalidate });
}

export function useUpdateProperty() {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<PropertyPayload>;
    }) => updateProperty(id, payload),
    onSuccess: invalidate,
  });
}

// Optimistic: the new status shows in every cached list at once and rolls back if the API refuses
export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: ManualPropertyStatus;
      reason?: string;
    }) => updatePropertyStatus(id, { status, reason }),
    onMutate: async ({ id, status }) => {
      const queryKey = ["managed-properties"];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueriesData<
        ApiResponse<ManagedProperty[]>
      >({ queryKey });
      queryClient.setQueriesData<ApiResponse<ManagedProperty[]>>(
        { queryKey },
        (old) =>
          old && {
            ...old,
            data: old.data.map((property) =>
              property.id === id ? { ...property, status } : property,
            ),
          },
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.previous ?? []) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: invalidate,
  });
}

export function useArchiveProperty() {
  const invalidate = useInvalidateListings();
  return useMutation({ mutationFn: archiveProperty, onSuccess: invalidate });
}

export function useDeletePropertyImage() {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      deletePropertyImage(id, imageId),
    onSuccess: invalidate,
  });
}

export function useCreateRoom() {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: RoomPayload;
    }) => createRoom(propertyId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateRoom() {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<RoomPayload>;
    }) => updateRoom(id, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateRoomStatus() {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ManualRoomStatus }) =>
      updateRoomStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useArchiveRoom() {
  const invalidate = useInvalidateListings();
  return useMutation({ mutationFn: archiveRoom, onSuccess: invalidate });
}

export function useDeleteRoomImage() {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      deleteRoomImage(id, imageId),
    onSuccess: invalidate,
  });
}

// Runs an upload that reports progress (0–100), then refreshes listing data
export function useUploadWithProgress<TArgs extends unknown[], TResult>(
  upload: (...args: [...TArgs, (percent: number) => void]) => Promise<TResult>,
) {
  const invalidate = useInvalidateListings();
  const [progress, setProgress] = useState<number | null>(null);

  const start = async (...args: TArgs) => {
    setProgress(0);
    try {
      const result = await upload(...args, setProgress);
      await invalidate();
      return result;
    } finally {
      setProgress(null);
    }
  };

  return { start, progress, isUploading: progress !== null };
}
