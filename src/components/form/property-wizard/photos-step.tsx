"use client";

import { Info } from "lucide-react";
import ImagePicker from "@/components/shared/image-picker";
import { usePropertyWizardStore } from "@/store/property-wizard.store";
import { StepNav } from "./wizard-nav";

// The backend takes up to 10 photos per upload; more can be added later from the property page
const MAX_PHOTOS = 10;

export default function PhotosStep() {
  const photos = usePropertyWizardStore((state) => state.photos);
  const setPhotos = usePropertyWizardStore((state) => state.setPhotos);
  const goTo = usePropertyWizardStore((state) => state.goTo);
  const step = usePropertyWizardStore((state) => state.step);

  return (
    <div className="space-y-6">
      <ImagePicker
        files={photos}
        onFilesChange={setPhotos}
        maxFiles={MAX_PHOTOS}
      />
      <p className="flex gap-2 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        The first photo is the cover. You need at least one photo to publish.
        Photos are kept only while this tab is open, and upload when you finish.
      </p>
      <StepNav
        onBack={() => goTo(step - 1)}
        onNext={() => goTo(step + 1)}
        nextLabel={photos.length ? "Continue" : "Skip for now"}
      />
    </div>
  );
}
