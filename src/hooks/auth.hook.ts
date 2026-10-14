import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getMe,
  googleOAuth,
  resendOtp,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyEmail,
} from "@/api";

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useGoogleOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,
    // Drop every cached query so the next user never sees the previous one's data
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useAuth() {
  const { data, isLoading } = useGetMe();
  const user = data?.data ?? null;
  const role = user?.role ?? null;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isTenant = role === "TENANT";
  const isOwner = role === "OWNER";

  return {
    user,
    role,
    isAdmin,
    isTenant,
    isOwner,
    isLoading,
  };
}
