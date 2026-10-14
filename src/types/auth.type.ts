import type { User, UserRole } from "./user.type";

// Roles a person can pick when signing up; admins are created by the super admin
export type RegisterRole = Extract<UserRole, "TENANT" | "OWNER">;

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: RegisterRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface EmailPayload {
  email: string;
}

export interface GoogleLoginPayload {
  idToken: string;
  role?: RegisterRole;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface GoogleAuthResult extends AuthResult {
  isNewUser: boolean;
}
