"use client";

import { Camera, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadProfileImage } from "@/api";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useObjectUrls,
  useRemoveProfileImage,
  useUploadWithProgress,
} from "@/hooks";
import type { User } from "@/types";
import { getErrorMessage, getInitials } from "@/utils";

// Same limits as the backend's imageUpload
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_MB = 5;

// Profile photo: pick, preview, upload with progress, or remove
export default function AvatarUploader({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const files = useMemo(() => (file ? [file] : []), [file]);
  const [previewUrl] = useObjectUrls(files);
  const upload = useUploadWithProgress(uploadProfileImage, [["user"]]);
  const remove = useRemoveProfileImage();

  const shown = previewUrl ?? user.imageUrl;

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    if (!ACCEPTED_TYPES.includes(picked.type)) {
      toast.error("Choose a JPG, PNG or WEBP image");
    } else if (picked.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`The photo must be under ${MAX_FILE_MB} MB`);
    } else {
      setFile(picked);
    }
  };

  const save = async () => {
    if (!file) return;
    try {
      await upload.start(user.id, file);
      toast.success("Profile photo updated");
      setFile(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={upload.isUploading}
        aria-label="Choose a new profile photo"
        className="group relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-background bg-accent shadow-md ring-1 ring-border"
      >
        {shown ? (
          <Image
            src={shown}
            alt=""
            fill
            sizes="112px"
            unoptimized={Boolean(previewUrl)}
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center font-heading text-3xl font-semibold text-primary">
            {getInitials(user.name)}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="size-6" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        hidden
        onChange={(event) => {
          pick(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="w-full min-w-0 space-y-3">
        <div>
          <p className="font-heading text-lg font-semibold">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>

        {upload.progress !== null ? (
          <div className="max-w-xs space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Uploading…</span>
              <span className="tabular-nums text-muted-foreground">
                {upload.progress}%
              </span>
            </div>
            <Progress value={upload.progress} aria-label="Upload progress" />
          </div>
        ) : file ? (
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button size="sm" onClick={save}>
              <Upload />
              Save photo
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFile(null)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <Camera />
              {user.imageUrl ? "Change photo" : "Add photo"}
            </Button>
            {user.imageUrl && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setConfirmRemove(true)}
              >
                <Trash2 />
                Remove
              </Button>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WEBP, up to {MAX_FILE_MB} MB.
        </p>
      </div>

      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title="Remove your profile photo?"
        description="Your initials will show instead."
        confirmLabel="Remove photo"
        destructive
        pending={remove.isPending}
        onConfirm={() =>
          remove.mutate(user.id, {
            onSuccess: () => {
              toast.success("Profile photo removed");
              setConfirmRemove(false);
            },
            onError: (error) => toast.error(getErrorMessage(error)),
          })
        }
      />
    </div>
  );
}
