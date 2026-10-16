import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProfileImage, updateUser } from "@/api";
import type { ApiResponse, UpdateProfilePayload, User } from "@/types";

// The signed-in user lives under ["user"] (useGetMe); write the server's copy straight into it
function useSetMe() {
  const queryClient = useQueryClient();
  return (response: ApiResponse<User>) =>
    queryClient.setQueryData<ApiResponse<User>>(["user"], (old) =>
      old ? { ...old, data: response.data } : response,
    );
}

export function useUpdateProfile() {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProfilePayload;
    }) => updateUser(id, payload),
    onSuccess: setMe,
  });
}

export function useRemoveProfileImage() {
  const setMe = useSetMe();
  return useMutation({ mutationFn: removeProfileImage, onSuccess: setMe });
}
