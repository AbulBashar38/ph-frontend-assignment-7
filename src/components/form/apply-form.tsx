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
import { useCreateApplication } from "@/hooks";
import { formatCurrency, getErrorMessage } from "@/utils";
import { applicationSchema, MAX_MOVE_IN_DAYS_AHEAD } from "@/validation";

export default function ApplyForm({
  roomId,
  maxOccupants,
  monthlyRent,
  onDone,
}: {
  roomId: string;
  maxOccupants: number;
  monthlyRent: number;
  onDone: () => void;
}) {
  const { mutate: apply, isPending } = useCreateApplication();
  const schema = applicationSchema(maxOccupants);

  const form = useForm({
    defaultValues: { moveInDate: "", occupants: 1, message: "" },
    validators: { onChange: schema, onSubmit: schema },
    onSubmit: ({ value }) => {
      apply(
        {
          roomId,
          // A date, not a moment: noon UTC is the same calendar day in every timezone
          moveInDate: `${value.moveInDate}T12:00:00.000Z`,
          occupants: value.occupants,
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="moveInDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="move-in">Move-in date</FieldLabel>
                  <Input
                    id="move-in"
                    type="date"
                    min={format(new Date(), "yyyy-MM-dd")}
                    max={format(
                      addDays(new Date(), MAX_MOVE_IN_DAYS_AHEAD),
                      "yyyy-MM-dd",
                    )}
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

          <form.Field name="occupants">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="occupants">People</FieldLabel>
                  <Input
                    id="occupants"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={maxOccupants}
                    value={
                      Number.isNaN(field.state.value) ? "" : field.state.value
                    }
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.valueAsNumber)
                    }
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : (
                    <FieldDescription>
                      Room fits {maxOccupants}
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="apply-message">
                  Message to the owner{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  id="apply-message"
                  rows={3}
                  placeholder="Introduce yourself: work or study, who will live here…"
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

        <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
          Rent is {formatCurrency(monthlyRent)} a month. If the owner approves,
          the room is reserved for you and you pay the first month online.
        </p>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner /> Sending application
            </>
          ) : (
            "Send application"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
