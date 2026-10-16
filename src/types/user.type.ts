export type UserRole = "SUPER_ADMIN" | "ADMIN" | "OWNER" | "TENANT";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  googleId: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  blockedAt: string | null;
  blockedReason: string | null;
  needPasswordChange: boolean;
  imageUrl: string | null;
  imagePublicId: string | null;
  gender: Gender | null;
  occupation: string | null;
  address: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// PATCH /user/:id: tenant-only (occupation, gender) and owner-only (address) fields; null clears them
export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  occupation?: string | null;
  gender?: Gender | null;
  address?: string | null;
}
