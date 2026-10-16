"use client";

import { useForm } from "@tanstack/react-form";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateViewing } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { MAX_VIEWING_DAYS_AHEAD, viewingSchema } from "@/validation";

const LOCAL_DATETIME = "yyyy-MM-dd'T'HH:mm";

export default function RequestViewingForm({
  propertyId,
  roomId,
  onDone,
}: {
  propertyId: string;
  roomId: string;
  onDone: () => void;
}) {
  const { mutate: requestViewing, isPending } = useCreateViewing();

  const form = useForm({
    defaultValues: { preferredAt: "", message: "" },
    validators: { onChange: viewingSchema, onSubmit: viewingSchema },
    onSubmit: ({ value }) => {
      requestViewing(
        {
          propertyId,
          roomId,
          preferredAt: new Date(value.preferredAt).toISOString(),
          message: value.message.trim() || undefined,
        },
        {
          onSuccess: (res) => {
            toast.success(res.message);
            onDone();
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      );
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="preferredAt">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="viewing-time">
                  Preferred date & time
                </FieldLabel>
                <Input
                  id="viewing-time"
                  type="datetime-local"
                  min={format(new Date(), LOCAL_DATETIME)}
                  max={format(
                    addDays(new Date(), MAX_VIEWING_DAYS_AHEAD),
                    LOCAL_DATETIME,
                  )}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : (
                  <FieldDescription>
                    The owner will approve it or suggest another time.
                  </FieldDescription>
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="viewing-message">
                  Message{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  id="viewing-message"
                  rows={3}
                  placeholder="Anything the owner should know?"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner /> Sending request
            </>
          ) : (
            "Send viewing request"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
