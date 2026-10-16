"use client";

import { toast } from "sonner";
import { uploadPropertyImages } from "@/api";
import PhotoManager from "@/components/shared/photo-manager";
import SectionCard from "@/components/shared/section-card";
import { useDeletePropertyImage, useUploadWithProgress } from "@/hooks";
import type { ManagedProperty } from "@/types";
import { getErrorMessage } from "@/utils";

// Same limit as the backend's MAX_IMAGES_PER_PROPERTY
const MAX_PROPERTY_PHOTOS = 20;

export default function PhotosTab({ property }: { property: ManagedProperty }) {
  const upload = useUploadWithProgress(uploadPropertyImages);
  const removeImage = useDeletePropertyImage();

  return (
    <SectionCard
      title="Property photos"
      description="Shown on the listing and in search results. Room photos are added on each room."
    >
      <PhotoManager
        photos={property.images}
        maxTotal={MAX_PROPERTY_PHOTOS}
        removing={removeImage.isPending}
        onRemove={(photo) =>
          removeImage
            .mutateAsync({ id: property.id, imageId: photo.id })
            .then(() => toast.success("Photo removed"))
            .catch((error) => toast.error(getErrorMessage(error)))
        }
        progress={upload.progress}
        onUpload={(files) => upload.start(property.id, files)}
      />
    </SectionCard>
  );
}
