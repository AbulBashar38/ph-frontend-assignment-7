"use client";

import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import { toast } from "sonner";
import FormActions from "@/components/form/form-actions";
import FormField from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useSendRoommateRequest } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { roommateRequestSchema } from "@/validation";

// Ask to connect: once they accept, both of you see each other's email and phone
export default function SendRequestDialog({
  open,
  onOpenChange,
  profileId,
  name,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
  name: string;
}) {
  const send = useSendRoommateRequest();
  const firstName = name.split(" ")[0];
  const form = useForm({
    defaultValues: { message: "" },
    validators: {
      onChange: roommateRequestSchema,
      onSubmit: roommateRequestSchema,
    },
    onSubmit: ({ value }) =>
      send.mutate(
        {
          receiverProfileId: profileId,
          message: value.message.trim() || undefined,
        },
        {
          onSuccess: () => {
            toast.success(`Request sent to ${firstName}`);
            onOpenChange(false);
            form.reset();
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      ),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !send.isPending && onOpenChange(next)}
    >
      <DialogContent className="p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Connect with {firstName}
          </DialogTitle>
          <DialogDescription>
            If {firstName} accepts, you'll both see each other's email and phone
            number.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-6">
            <form.Field name="message">
              {(field) => (
                <FormField
                  field={field}
                  id="request-message"
                  label="Message"
                  optional
                  description={`${field.state.value.trim().length} / 500`}
                >
                  {(isInvalid) => (
                    <Textarea
                      id="request-message"
                      rows={4}
                      maxLength={500}
                      placeholder={`Hi ${firstName}! I'm looking for a place around the same area and budget…`}
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
            <FormActions
              submitLabel="Send request"
              pendingLabel="Sending"
              icon={<Send />}
              pending={send.isPending}
              secondary={
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              }
            />
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
