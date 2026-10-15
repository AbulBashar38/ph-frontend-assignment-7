import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariantsBase = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        // Amber call-to-action, mainly on colored or dark sections
        highlight:
          "bg-highlight text-highlight-foreground shadow-sm hover:bg-highlight/90",
        // Outline that takes the surrounding text color, for dark or colored backgrounds
        inverse:
          "border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current",
      },
      size: {
        default:
          "h-14 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "h-10 gap-1.5 rounded-[min(var(--radius-md),10px)] px-3 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-12 gap-1.5 px-4 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-15 gap-2 px-7 text-base font-semibold has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        xl: "h-16 gap-2.5 px-8 text-lg font-semibold has-data-[icon=inline-end]:pr-7 has-data-[icon=inline-start]:pl-7 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-14 [&_svg:not([class*='size-'])]:size-5",
        "icon-xs":
          "size-10 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-12 in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-15 [&_svg:not([class*='size-'])]:size-5",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariantsBase>;

// Merges className with tailwind conflict resolution, so overrides win (cva alone only appends)
function buttonVariants({
  className,
  ...props
}: ButtonVariantProps & { className?: string } = {}) {
  return cn(buttonVariantsBase(props), className);
}

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  ...props
}: ButtonPrimitive.Props & ButtonVariantProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      // Base UI also accepts className as a function of the button's state
      className={
        typeof className === "function"
          ? (state) =>
              buttonVariants({
                variant,
                size,
                shape,
                className: className(state),
              })
          : buttonVariants({ variant, size, shape, className })
      }
      {...props}
    />
  );
}

export { Button, buttonVariants };
