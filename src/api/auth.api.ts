import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthResult,
  ChangePasswordPayload,
  EmailPayload,
  GoogleAuthResult,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from "@/types";

export function userRegistration(payload: RegisterPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient<ApiResponse<AuthResult>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function resendOtp(payload: EmailPayload) {
  return apiClient<ApiResponse<null>>("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthResult>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function googleOAuth(payload: GoogleLoginPayload) {
  return apiClient<ApiResponse<GoogleAuthResult>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/auth/me");
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "PATCH",
    body: payload,
  });
}

export function forgotPassword(payload: EmailPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}
