import {
  BookOpen,
  CookingPot,
  Dumbbell,
  Gamepad2,
  HandHeart,
  Laptop,
  type LucideIcon,
  Music,
  PartyPopper,
  Salad,
  Sparkles,
  Users,
  VolumeX,
} from "lucide-react";
import type {
  CompatibilityPart,
  Gender,
  LifestyleTag,
  Preference,
  SleepSchedule,
} from "@/types";

export const LIFESTYLE_OPTIONS: {
  value: LifestyleTag;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "QUIET", label: "Quiet", icon: VolumeX },
  { value: "SOCIAL", label: "Social", icon: Users },
  { value: "CLEAN", label: "Tidy", icon: Sparkles },
  { value: "STUDIOUS", label: "Studious", icon: BookOpen },
  { value: "WORK_FROM_HOME", label: "Works from home", icon: Laptop },
  { value: "FITNESS", label: "Fitness", icon: Dumbbell },
  { value: "COOKING", label: "Cooks", icon: CookingPot },
  { value: "GAMING", label: "Gaming", icon: Gamepad2 },
  { value: "MUSIC", label: "Music", icon: Music },
  { value: "VEGETARIAN", label: "Vegetarian", icon: Salad },
  { value: "RELIGIOUS", label: "Religious", icon: HandHeart },
  { value: "PARTY", label: "Likes parties", icon: PartyPopper },
];

export const lifestyleOption = (tag: LifestyleTag) =>
  LIFESTYLE_OPTIONS.find((option) => option.value === tag) ??
  LIFESTYLE_OPTIONS[0];

export const SLEEP_LABELS: Record<SleepSchedule, string> = {
  EARLY_BIRD: "Early bird",
  NIGHT_OWL: "Night owl",
  FLEXIBLE: "Flexible hours",
};

// YES = "I do it or I'm fine with it", NO = "please no" (backend enums.prisma)
export const SMOKING_LABELS: Record<Preference, string> = {
  YES: "Smoking is fine",
  NO: "No smoking",
  NO_PREFERENCE: "Don't mind",
};

export const PET_LABELS: Record<Preference, string> = {
  YES: "Pets are welcome",
  NO: "No pets",
  NO_PREFERENCE: "Don't mind",
};

export const GENDER_LABELS: Record<Gender, string> = {
  FEMALE: "Female",
  MALE: "Male",
  OTHER: "Other",
};

export const PART_LABELS: Record<CompatibilityPart, string> = {
  budget: "Budget",
  location: "Location",
  moveIn: "Move-in date",
  lifestyle: "Lifestyle",
  smoking: "Smoking",
  pets: "Pets",
  sleepSchedule: "Sleep schedule",
};
