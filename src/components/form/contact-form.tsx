"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Send } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useAuth, useSendContactMessage } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { contactSchema } from "@/validation";

const MESSAGE_MAX = 2000;

type TextFieldName = "name" | "email" | "subject";

const TEXT_FIELDS: {
  name: TextFieldName;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}[] = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    autoComplete: "name",
    placeholder: "Full name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    autoComplete: "off",
    placeholder: "What is it about?",
  },
];

export default function ContactForm() {
  const { user } = useAuth();
  const { mutate: send, isPending } = useSendContactMessage();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    validators: { onChange: contactSchema, onSubmit: contactSchema },
    onSubmit: ({ value }) => {
      send(value, {
        onSuccess: (res) => {
          toast.success(res.message);
          setSentTo(value.email.trim());
          form.reset();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      });
    },
  });

  // Logged-in users don't have to type their name and email again
  useEffect(() => {
    if (!user) return;
    if (!form.getFieldValue("name")) form.setFieldValue("name", user.name);
    if (!form.getFieldValue("email")) form.setFieldValue("email", user.email);
  }, [user, form]);

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <div>
          <p className="font-heading text-xl font-semibold">Message sent</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll reply to <span className="font-medium">{sentTo}</span>.
          </p>
        </div>
        <Button variant="outline" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

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
          {TEXT_FIELDS.slice(0, 2).map((config) => (
            <form.Field key={config.name} name={config.name}>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={`contact-${config.name}`}>
                      {config.label}
                    </FieldLabel>
                    <Input
                      id={`contact-${config.name}`}
                      type={config.type}
                      autoComplete={config.autoComplete}
                      placeholder={config.placeholder}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          ))}
        </div>

        <form.Field name="subject">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const config = TEXT_FIELDS[2];
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="contact-subject">
                  {config.label}
                </FieldLabel>
                <Input
                  id="contact-subject"
                  placeholder={config.placeholder}
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

        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                <Textarea
                  id="contact-message"
                  rows={6}
                  maxLength={MESSAGE_MAX}
                  placeholder="Tell us how we can help…"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : (
                  <FieldDescription className="text-right">
                    {field.state.value.length} / {MESSAGE_MAX}
                  </FieldDescription>
                )}
              </Field>
            );
          }}
        </form.Field>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto sm:self-start"
        >
          {isPending ? (
            <>
              <Spinner /> Sending
            </>
          ) : (
            <>
              <Send /> Send message
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
