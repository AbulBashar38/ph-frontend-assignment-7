import type { QueryParams } from "./api.type";
import type { Gender } from "./user.type";

// Same enums as the backend (prisma/schema/enums.prisma)
export type Preference = "YES" | "NO" | "NO_PREFERENCE";
export type SleepSchedule = "EARLY_BIRD" | "NIGHT_OWL" | "FLEXIBLE";
export type LifestyleTag =
  | "QUIET"
  | "SOCIAL"
  | "CLEAN"
  | "STUDIOUS"
  | "WORK_FROM_HOME"
  | "FITNESS"
  | "COOKING"
  | "GAMING"
  | "MUSIC"
  | "VEGETARIAN"
  | "RELIGIOUS"
  | "PARTY";
// PENDING → ACCEPTED | DECLINED (the receiver) | CANCELLED (the sender)
export type RoommateRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELLED";

export interface RoommatePerson {
  id: string;
  name: string;
  imageUrl: string | null;
  gender: Gender | null;
  occupation: string | null;
}

export interface RoommateProfile {
  id: string;
  age: number;
  budgetMin: number;
  budgetMax: number;
  preferredCity: string;
  preferredArea: string | null;
  moveInDate: string;
  smokingPreference: Preference;
  petPreference: Preference;
  sleepSchedule: SleepSchedule;
  lifestyle: LifestyleTag[];
  // Gender of the roommate they want; null = any
  genderPreference: Gender | null;
  bio: string | null;
  updatedAt: string;
  tenant: RoommatePerson;
}

// GET /roommate/profile/me adds the owner-only fields
export interface MyRoommateProfile extends RoommateProfile {
  isActive: boolean;
  createdAt: string;
  tenantId: string;
}

export type CompatibilityPart =
  | "budget"
  | "location"
  | "moveIn"
  | "lifestyle"
  | "smoking"
  | "pets"
  | "sleepSchedule";

export interface Compatibility {
  // 0–100
  score: number;
  label: string;
  breakdown: Record<
    CompatibilityPart,
    { score: number; max: number; label: string }
  >;
}

// GET /roommate/matches and /roommate/profile/:id
export interface RoommateMatch extends RoommateProfile {
  compatibility: Compatibility;
}

// Email and phone are only included once a request is ACCEPTED
export interface RoommateContact extends RoommatePerson {
  email?: string;
  phone?: string | null;
  roommateProfile: { id: string } | null;
}

export interface RoommateRequest {
  id: string;
  message: string | null;
  status: RoommateRequestStatus;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  receiverId: string;
  sender: RoommateContact;
  receiver: RoommateContact;
}

export interface RoommateConnection {
  roommateRequestId: string;
  connectedAt: string | null;
  user: RoommateContact;
}

// POST /roommate/profile and PATCH /roommate/profile/me (dates as ISO strings)
export interface RoommateProfilePayload {
  age: number;
  budgetMin: number;
  budgetMax: number;
  preferredCity: string;
  preferredArea: string | null;
  moveInDate: string;
  smokingPreference: Preference;
  petPreference: Preference;
  sleepSchedule: SleepSchedule;
  lifestyle: LifestyleTag[];
  genderPreference: Gender | null;
  bio: string | null;
  // Saved on the account
  gender: Gender;
  occupation: string | null;
}

export interface RoommateMatchQueryParams extends QueryParams {
  minScore?: number;
}

export interface RoommateRequestQueryParams extends QueryParams {
  type?: "received" | "sent";
  status?: RoommateRequestStatus;
}
