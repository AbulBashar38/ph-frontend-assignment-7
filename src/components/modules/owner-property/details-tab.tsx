"use client";

import { Save } from "lucide-react";
import { toast } from "sonner";
import PropertyAmenitiesForm from "@/components/form/property-amenities-form";
import PropertyDetailsForm from "@/components/form/property-details-form";
import PropertyLocationForm from "@/components/form/property-location-form";
import SectionCard from "@/components/shared/section-card";
import { useUpdateProperty } from "@/hooks";
import type { ManagedProperty, PropertyPayload } from "@/types";
import { getErrorMessage } from "@/utils";

const save = <Save />;

// Each section saves on its own, so a typo fix doesn't resend the whole listing
export default function DetailsTab({
  property,
}: {
  property: ManagedProperty;
}) {
  const { mutate, isPending, variables } = useUpdateProperty();
  // Which section is saving (so only its button spins)
  const savingKey = isPending ? Object.keys(variables?.payload ?? {})[0] : null;

  const update = (payload: Partial<PropertyPayload>, message: string) =>
    mutate(
      { id: property.id, payload },
      {
        onSuccess: () => toast.success(message),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );

  return (
    <div className="space-y-6">
      <SectionCard title="Details" description="Title, type and description">
        <PropertyDetailsForm
          defaultValues={{
            title: property.title,
            description: property.description,
            propertyType: property.propertyType,
          }}
          submitLabel="Save details"
          submitIcon={save}
          pending={savingKey === "title"}
          onSubmit={(values) =>
            update(
              {
                title: values.title.trim(),
                description: values.description.trim(),
                propertyType: values.propertyType || undefined,
              },
              "Details saved",
            )
          }
        />
      </SectionCard>

      <SectionCard title="Location">
        <PropertyLocationForm
          defaultValues={{
            address: property.address,
            city: property.city,
            area: property.area,
          }}
          submitLabel="Save location"
          submitIcon={save}
          pending={savingKey === "address"}
          onSubmit={(values) =>
            update(
              {
                address: values.address.trim(),
                city: values.city.trim(),
                area: values.area.trim(),
              },
              "Location saved",
            )
          }
        />
      </SectionCard>

      <SectionCard title="Amenities">
        <PropertyAmenitiesForm
          defaultValues={property.amenities}
          submitLabel="Save amenities"
          submitIcon={save}
          pending={savingKey === "amenities"}
          onSubmit={(amenities) => update({ amenities }, "Amenities saved")}
        />
      </SectionCard>
    </div>
  );
}
