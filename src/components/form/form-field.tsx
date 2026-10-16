import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

// Label, hint and live error around one TanStack Form field; the control comes from children
export default function FormField({
  field,
  id,
  label,
  description,
  optional = false,
  className,
  children,
}: {
  field: AnyFieldApi;
  id: string;
  label: ReactNode;
  description?: ReactNode;
  optional?: boolean;
  className?: string;
  children: (isInvalid: boolean) => ReactNode;
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </FieldLabel>
      {children(isInvalid)}
      {isInvalid ? (
        <FieldError errors={field.state.meta.errors} />
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
