"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/store/property-wizard.store";

// Where the owner is in the wizard; finished steps can be revisited
export default function WizardStepper({
  step,
  onStepClick,
  disabled = false,
}: {
  step: number;
  onStepClick: (step: number) => void;
  disabled?: boolean;
}) {
  const total = WIZARD_STEPS.length;

  return (
    <nav aria-label="Add property steps">
      {/* Phones: one line and a bar */}
      <div className="space-y-2 md:hidden">
        <p className="text-sm">
          <span className="font-semibold">
            Step {step + 1} of {total}
          </span>
          <span className="text-muted-foreground">
            {" "}
            · {WIZARD_STEPS[step].title}
          </span>
        </p>
        <Progress
          value={((step + 1) / total) * 100}
          aria-label="Wizard progress"
        />
      </div>

      <ol className="hidden items-center gap-2 md:flex">
        {WIZARD_STEPS.map((item, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={item.key} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!done || disabled}
                onClick={() => onStepClick(index)}
                aria-current={current ? "step" : undefined}
                className="group flex items-center gap-2 rounded-full py-1 pr-2 text-left text-sm font-medium disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    done &&
                      "border-primary bg-primary text-primary-foreground group-enabled:group-hover:bg-primary/85",
                    current &&
                      "border-primary text-primary ring-4 ring-primary/15",
                    !done && !current && "text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap",
                    !done && !current && "text-muted-foreground",
                    done && "group-enabled:group-hover:text-primary",
                  )}
                >
                  {item.title}
                </span>
              </button>
              {index < total - 1 && (
                <span
                  aria-hidden="true"
                  className={cn("h-px flex-1 bg-border", done && "bg-primary")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
