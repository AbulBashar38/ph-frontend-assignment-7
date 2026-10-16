"use client";

import { ImageOff, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ConfirmDialog from "./confirm-dialog";

interface Photo {
  id: string;
  url: string;
}

// Photos already uploaded; each can be removed after confirming
export default function PhotoGrid({
  photos,
  onRemove,
  removing = false,
  emptyText = "No photos yet.",
}: {
  photos: Photo[];
  onRemove?: (photo: Photo) => Promise<unknown>;
  removing?: boolean;
  emptyText?: string;
}) {
  const [target, setTarget] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <ImageOff className="size-4" />
        {emptyText}
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <li
            key={photo.id}
            className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
          >
            <Image
              src={photo.url}
              alt={`Photo ${index + 1}`}
              fill
              sizes="(max-width: 640px) 33vw, 200px"
              className="object-cover"
            />
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold">
                Cover
              </span>
            )}
            {onRemove && (
              <button
                type="button"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => setTarget(photo)}
                className="absolute top-1.5 right-1.5 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-destructive hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Remove this photo?"
        description="It will be deleted from the listing."
        confirmLabel="Remove photo"
        destructive
        pending={removing}
        onConfirm={async () => {
          if (target && onRemove) await onRemove(target);
          setTarget(null);
        }}
      />
    </>
  );
}
