"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  requiredNoteSchema,
  rescheduleSchema,
  type StatusNoteValues,
  statusNoteSchema,
} from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

// The note (and, for a reschedule, the new time) that goes with a status change
export default function StatusNoteForm({
  withDateTime = false,
  noteRequired = false,
  noteLabel,
  notePlaceholder,
  submitLabel,
  destructive = false,
  pending,
  onCancel,
  onSubmit,
}: {
  withDateTime?: boolean;
  noteRequired?: boolean;
  noteLabel: string;
  notePlaceholder?: string;
  submitLabel: string;
  destructive?: boolean;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: StatusNoteValues) => void;
}) {
  const schema = withDateTime
    ? rescheduleSchema
    : noteRequired
      ? requiredNoteSchema
      : statusNoteSchema;
  const form = useForm({
    defaultValues: { note: "", scheduledAt: "" },
    validators: { onChange: schema, onSubmit: schema },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-6">
        {withDateTime && (
          <form.Field name="scheduledAt">
            {(field) => (
              <FormField
                field={field}
                id="status-time"
                label="New date and time"
              >
                {(isInvalid) => (
                  <Input
                    id="status-time"
                    type="datetime-local"
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>
        )}

        <form.Field name="note">
          {(field) => (
            <FormField
              field={field}
              id="status-note"
              label={noteLabel}
              optional={!noteRequired}
              description={`${field.state.value.trim().length} / 500`}
            >
              {(isInvalid) => (
                <Textarea
                  id="status-note"
                  rows={3}
                  maxLength={500}
                  placeholder={notePlaceholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
              )}
            </FormField>
          )}
        </form.Field>

        <FormActions
          submitLabel={submitLabel}
          pending={pending}
          secondary={
            <Button type="button" variant="ghost" onClick={onCancel}>
              Back
            </Button>
          }
          variant={destructive ? "destructive" : "default"}
        />
      </FieldGroup>
    </form>
  );
}
