"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Moon, Save, Sun, SunMoon } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  GENDER_LABELS,
  LIFESTYLE_OPTIONS,
  PET_LABELS,
  SLEEP_LABELS,
  SMOKING_LABELS,
} from "@/components/modules/roommate/roommate-labels";
import TogglePicker from "@/components/shared/toggle-picker";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useSaveRoommateProfile } from "@/hooks";
import type {
  Gender,
  MyRoommateProfile,
  Preference,
  SleepSchedule,
} from "@/types";
import { getErrorMessage } from "@/utils";
import {
  type RoommateProfileValues,
  roommateProfileSchema,
  toRoommatePayload,
} from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

const SLEEP_ICONS: Record<SleepSchedule, ReactNode> = {
  EARLY_BIRD: <Sun />,
  NIGHT_OWL: <Moon />,
  FLEXIBLE: <SunMoon />,
};
const PREFERENCES: Preference[] = ["NO_PREFERENCE", "NO", "YES"];
const GENDERS: Gender[] = ["FEMALE", "MALE", "OTHER"];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-4 font-heading text-base font-semibold">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

// Everything roommate matching scores on; creates the profile the first time, edits it afterwards
export default function RoommateProfileForm({
  profile,
  onSaved,
}: {
  profile: MyRoommateProfile | null;
  onSaved?: () => void;
}) {
  const { user } = useAuth();
  const save = useSaveRoommateProfile(Boolean(profile));

  const defaultValues: RoommateProfileValues = {
    gender: profile?.tenant.gender ?? user?.gender ?? "",
    age: profile?.age ?? Number.NaN,
    occupation: profile?.tenant.occupation ?? user?.occupation ?? "",
    budgetMin: profile?.budgetMin ?? Number.NaN,
    budgetMax: profile?.budgetMax ?? Number.NaN,
    preferredCity: profile?.preferredCity ?? "Dhaka",
    preferredArea: profile?.preferredArea ?? "",
    moveInDate: profile
      ? format(new Date(profile.moveInDate), "yyyy-MM-dd")
      : "",
    sleepSchedule: profile?.sleepSchedule ?? "FLEXIBLE",
    smokingPreference: profile?.smokingPreference ?? "NO_PREFERENCE",
    petPreference: profile?.petPreference ?? "NO_PREFERENCE",
    genderPreference: profile?.genderPreference ?? "",
    lifestyle: profile?.lifestyle ?? [],
    bio: profile?.bio ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: roommateProfileSchema,
      onSubmit: roommateProfileSchema,
    },
    onSubmit: ({ value }) =>
      save.mutate(toRoommatePayload(value), {
        onSuccess: () => {
          toast.success(
            profile
              ? "Roommate profile saved"
              : "Roommate profile created. Your matches are ready",
          );
          onSaved?.();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      }),
  });

  // Number inputs: an empty box is NaN, which the schema reports as "enter …"
  const numberInput = (
    id: string,
    field: {
      state: { value: number };
      handleBlur: () => void;
      handleChange: (value: number) => void;
    },
    isInvalid: boolean,
    extra: { min?: number; max?: number; step?: number; placeholder?: string },
  ) => (
    <Input
      id={id}
      type="number"
      inputMode="numeric"
      {...extra}
      value={Number.isNaN(field.state.value) ? "" : field.state.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.valueAsNumber)}
      aria-invalid={isInvalid}
    />
  );

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-10">
        <Section title="About you">
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-3">
            <form.Field name="gender">
              {(field) => (
                <FormField field={field} id="rm-gender" label="Gender">
                  {(isInvalid) => (
                    <NativeSelect
                      id="rm-gender"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value as Gender | "")
                      }
                      aria-invalid={isInvalid}
                    >
                      <option value="" disabled>
                        Choose
                      </option>
                      {GENDERS.map((gender) => (
                        <option key={gender} value={gender}>
                          {GENDER_LABELS[gender]}
                        </option>
                      ))}
                    </NativeSelect>
                  )}
                </FormField>
              )}
            </form.Field>
            <form.Field name="age">
              {(field) => (
                <FormField field={field} id="rm-age" label="Age">
                  {(isInvalid) =>
                    numberInput("rm-age", field, isInvalid, {
                      min: 18,
                      max: 100,
                    })
                  }
                </FormField>
              )}
            </form.Field>
            <form.Field name="occupation">
              {(field) => (
                <FormField
                  field={field}
                  id="rm-occupation"
                  label="Occupation"
                  optional
                >
                  {(isInvalid) => (
                    <Input
                      id="rm-occupation"
                      placeholder="Student, engineer…"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                  )}
                </FormField>
              )}
            </form.Field>
          </div>
        </Section>

        <Section title="Budget and place">
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <form.Field name="budgetMin">
              {(field) => (
                <FormField
                  field={field}
                  id="rm-budget-min"
                  label="Monthly budget from (৳)"
                >
                  {(isInvalid) =>
                    numberInput("rm-budget-min", field, isInvalid, {
                      min: 500,
                      step: 500,
                      placeholder: "8000",
                    })
                  }
                </FormField>
              )}
            </form.Field>
            <form.Field name="budgetMax">
              {(field) => (
                <FormField
                  field={field}
                  id="rm-budget-max"
                  label="Monthly budget up to (৳)"
                >
                  {(isInvalid) =>
                    numberInput("rm-budget-max", field, isInvalid, {
                      min: 500,
                      step: 500,
                      placeholder: "14000",
                    })
                  }
                </FormField>
              )}
            </form.Field>
            <form.Field name="preferredCity">
              {(field) => (
                <FormField field={field} id="rm-city" label="City">
                  {(isInvalid) => (
                    <Input
                      id="rm-city"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                  )}
                </FormField>
              )}
            </form.Field>
            <form.Field name="preferredArea">
              {(field) => (
                <FormField
                  field={field}
                  id="rm-area"
                  label="Area"
                  optional
                  description="Matching scores the same area higher."
                >
                  {(isInvalid) => (
                    <Input
                      id="rm-area"
                      placeholder="Bashundhara, Mirpur…"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                  )}
                </FormField>
              )}
            </form.Field>
            <form.Field name="moveInDate">
              {(field) => (
                <FormField
                  field={field}
                  id="rm-move-in"
                  label="Ready to move in"
                >
                  {(isInvalid) => (
                    <Input
                      id="rm-move-in"
                      type="date"
                      min={format(new Date(), "yyyy-MM-dd")}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                  )}
                </FormField>
              )}
            </form.Field>
            <form.Field name="genderPreference">
              {(field) => (
                <FormField
                  field={field}
                  id="rm-gender-pref"
                  label="Roommate gender"
                  description="Only people who fit see each other."
                >
                  {(isInvalid) => (
                    <NativeSelect
                      id="rm-gender-pref"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value as Gender | "")
                      }
                      aria-invalid={isInvalid}
                    >
                      <option value="">Anyone</option>
                      {GENDERS.map((gender) => (
                        <option key={gender} value={gender}>
                          {GENDER_LABELS[gender]} only
                        </option>
                      ))}
                    </NativeSelect>
                  )}
                </FormField>
              )}
            </form.Field>
          </div>
        </Section>

        <Section title="How you live">
          <form.Field name="sleepSchedule">
            {(field) => (
              <div className="space-y-3">
                <FieldLabel>Sleep schedule</FieldLabel>
                <RadioGroup
                  aria-label="Sleep schedule"
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as SleepSchedule)
                  }
                  className="grid-cols-1 gap-3 sm:grid-cols-3"
                >
                  {(Object.keys(SLEEP_LABELS) as SleepSchedule[]).map(
                    (schedule) => (
                      <RadioCard
                        key={schedule}
                        value={schedule}
                        icon={SLEEP_ICONS[schedule]}
                        title={SLEEP_LABELS[schedule]}
                      />
                    ),
                  )}
                </RadioGroup>
              </div>
            )}
          </form.Field>

          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <form.Field name="smokingPreference">
              {(field) => (
                <FormField field={field} id="rm-smoking" label="Smoking">
                  {(isInvalid) => (
                    <NativeSelect
                      id="rm-smoking"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value as Preference)
                      }
                      aria-invalid={isInvalid}
                    >
                      {PREFERENCES.map((preference) => (
                        <option key={preference} value={preference}>
                          {SMOKING_LABELS[preference]}
                        </option>
                      ))}
                    </NativeSelect>
                  )}
                </FormField>
              )}
            </form.Field>
            <form.Field name="petPreference">
              {(field) => (
                <FormField field={field} id="rm-pets" label="Pets">
                  {(isInvalid) => (
                    <NativeSelect
                      id="rm-pets"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value as Preference)
                      }
                      aria-invalid={isInvalid}
                    >
                      {PREFERENCES.map((preference) => (
                        <option key={preference} value={preference}>
                          {PET_LABELS[preference]}
                        </option>
                      ))}
                    </NativeSelect>
                  )}
                </FormField>
              )}
            </form.Field>
          </div>

          <form.Field name="lifestyle">
            {(field) => (
              <div className="space-y-3">
                <FieldLabel>Lifestyle</FieldLabel>
                <TogglePicker
                  label="Lifestyle"
                  options={LIFESTYLE_OPTIONS}
                  value={field.state.value}
                  onChange={field.handleChange}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="bio">
            {(field) => (
              <FormField
                field={field}
                id="rm-bio"
                label="About you"
                optional
                description={`${field.state.value.trim().length} / 1000`}
              >
                {(isInvalid) => (
                  <Textarea
                    id="rm-bio"
                    rows={4}
                    maxLength={1000}
                    placeholder="What's your day like? What would make a good roommate for you?"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>
        </Section>

        <FormActions
          submitLabel={profile ? "Save profile" : "Create profile"}
          icon={<Save />}
          pending={save.isPending}
        />
      </FieldGroup>
    </form>
  );
}
