"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  usePropertyWizardStore,
  WIZARD_STEPS,
} from "@/store/property-wizard.store";
import PropertyAmenitiesForm from "../property-amenities-form";
import PropertyDetailsForm from "../property-details-form";
import PropertyLocationForm from "../property-location-form";
import PhotosStep from "./photos-step";
import ReviewStep from "./review-step";
import RoomsStep from "./rooms-step";
import { BackButton } from "./wizard-nav";
import WizardStepper from "./wizard-stepper";

const STEP_INTROS = [
  "Name the listing and say what kind of place it is.",
  "Where is it? Tenants search by area and city.",
  "What does the building offer?",
  "Good photos get more viewing requests.",
  "Add the rooms you rent out, each with its own rent.",
  "Check everything, then create the listing.",
];

const next = <ArrowRight />;

// "Add property": details → location → amenities → photos → rooms & rent → review
export default function PropertyWizard() {
  const router = useRouter();
  const store = usePropertyWizardStore();
  const { step, goTo } = store;
  const [leaving, setLeaving] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownStep = useRef(step);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, [step]);

  const back = <BackButton onClick={() => goTo(step - 1)} />;
  const hasDraft =
    step > 0 || store.details.title !== "" || store.rooms.length > 0;

  if (leaving) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-3xl border bg-card p-16 text-muted-foreground">
        <Spinner /> Opening your listing…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WizardStepper step={step} onStepClick={goTo} />

      <section
        aria-labelledby="wizard-step-title"
        className="rounded-3xl border bg-card p-5 shadow-xs sm:p-8"
      >
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="wizard-step-title"
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-xl font-semibold outline-none sm:text-2xl"
            >
              {WIZARD_STEPS[step].title}
            </h2>
            <p className="mt-1 text-muted-foreground">{STEP_INTROS[step]}</p>
          </div>
          {hasDraft && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={store.reset}
              className="self-start text-muted-foreground"
            >
              <RotateCcw />
              Start over
            </Button>
          )}
        </div>

        {step === 0 && (
          <PropertyDetailsForm
            defaultValues={store.details}
            onSubmit={store.saveDetails}
            submitLabel="Continue"
            submitIcon={next}
          />
        )}
        {step === 1 && (
          <PropertyLocationForm
            defaultValues={store.location}
            onSubmit={store.saveLocation}
            submitLabel="Continue"
            submitIcon={next}
            secondary={back}
          />
        )}
        {step === 2 && (
          <PropertyAmenitiesForm
            defaultValues={store.amenities}
            onSubmit={store.saveAmenities}
            submitLabel="Continue"
            submitIcon={next}
            secondary={back}
          />
        )}
        {step === 3 && <PhotosStep />}
        {step === 4 && <RoomsStep />}
        {step === 5 && (
          <ReviewStep
            onFinished={(propertyId) => {
              setLeaving(true);
              router.push(`/owner/properties/${propertyId}`);
              store.reset();
            }}
          />
        )}
      </section>
    </div>
  );
}
