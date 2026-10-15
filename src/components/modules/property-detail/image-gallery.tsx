"use client";

import { Building2, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
}

// Large photo with previous/next and a thumbnail strip
export default function ImageGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-accent to-secondary text-primary/60">
        <Building2 className="size-14" />
        <p className="text-sm font-medium">No photos yet</p>
      </div>
    );
  }

  const go = (step: number) =>
    setIndex((current) => (current + step + images.length) % images.length);

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted sm:aspect-[16/9]">
        {images.map((image, imageIndex) => (
          <Image
            key={image.id}
            src={image.url}
            alt={`${title}, photo ${imageIndex + 1} of ${images.length}`}
            fill
            priority={imageIndex === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              imageIndex === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon-sm"
              shape="pill"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-background/90 backdrop-blur"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              shape="pill"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-background/90 backdrop-blur"
            >
              <ChevronRight />
            </Button>
          </>
        )}

        <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          <Images className="size-3.5" />
          {index + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, imageIndex) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show photo ${imageIndex + 1}`}
              aria-current={imageIndex === index}
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:w-28",
                imageIndex === index
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
