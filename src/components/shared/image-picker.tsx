"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils";

// Same limits as the backend's imageUpload (lib/multer.ts)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_MB = 5;

// Choose photos to upload: drop or browse, previews, per-file checks, optional progress bar
export default function ImagePicker({
  files,
  onFilesChange,
  maxFiles,
  progress = null,
  disabled = false,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
  // How many more photos may be added right now
  maxFiles: number;
  progress?: number | null;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  // Free the preview URLs when the selection changes or the picker unmounts
  useEffect(
    () => () => {
      for (const preview of previews) URL.revokeObjectURL(preview.url);
    },
    [previews],
  );

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG or WEBP images`);
      } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${file.name} is larger than ${MAX_FILE_MB} MB`);
      } else {
        accepted.push(file);
      }
    }
    const room = maxFiles - files.length;
    if (accepted.length > room) {
      toast.error(`You can add ${room} more photo${room === 1 ? "" : "s"}`);
    }
    onFilesChange([...files, ...accepted.slice(0, Math.max(0, room))]);
  };

  const full = files.length >= maxFiles;

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={disabled || full}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (!disabled && !full) addFiles(event.dataTransfer.files);
        }}
        className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/40 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
          <ImagePlus className="size-6" />
        </span>
        <span className="font-medium">
          {full ? "Photo limit reached" : "Drop photos here or browse"}
        </span>
        <span className="text-sm text-muted-foreground">
          JPG, PNG or WEBP, up to {MAX_FILE_MB} MB each ·{" "}
          {Math.max(0, maxFiles - files.length)} more allowed
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        hidden
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {previews.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {previews.map(({ file, url }, index) => (
            <li
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
            >
              <Image
                src={url}
                alt={file.name}
                fill
                unoptimized
                sizes="160px"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold">
                  Cover
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {formatFileSize(file.size)}
              </span>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() =>
                    onFilesChange(files.filter((_, i) => i !== index))
                  }
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-destructive hover:text-white"
                >
                  <X className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {progress !== null && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Uploading photos…</span>
            <span className={cn("tabular-nums text-muted-foreground")}>
              {progress}%
            </span>
          </div>
          <Progress value={progress} aria-label="Upload progress" />
        </div>
      )}
    </div>
  );
}
