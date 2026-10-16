import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" onClick={onClick}>
      <ArrowLeft />
      Back
    </Button>
  );
}

// Footer for the steps that aren't forms (photos, rooms)
export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BackButton onClick={onBack} />
      </div>
      <Button type="button" onClick={onNext} className="sm:min-w-44">
        {nextLabel}
        <ArrowRight />
      </Button>
    </div>
  );
}
