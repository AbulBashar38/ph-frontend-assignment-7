"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils";
import ImagePicker from "./image-picker";
import PhotoGrid from "./photo-grid";

// The backend accepts up to 10 photos per upload request
const PER_UPLOAD = 10;

// Uploaded photos (removable) plus a picker that uploads new ones with a progress bar
export default function PhotoManager({
  photos,
  maxTotal,
  onRemove,
  removing,
  onUpload,
  progress,
}: {
  photos: { id: string; url: string }[];
  maxTotal: number;
  onRemove: (photo: { id: string; url: string }) => Promise<unknown>;
  removing: boolean;
  onUpload: (files: File[]) => Promise<unknown>;
  progress: number | null;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const uploading = progress !== null;
  const room = Math.max(0, Math.min(PER_UPLOAD, maxTotal - photos.length));

  const upload = async () => {
    try {
      await onUpload(files);
      toast.success(
        `${files.length} photo${files.length === 1 ? "" : "s"} uploaded`,
      );
      setFiles([]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {photos.length} of {maxTotal} photos · the first one is the cover
        </p>
        <PhotoGrid photos={photos} onRemove={onRemove} removing={removing} />
      </div>

      {room > 0 || files.length > 0 ? (
        <div className="space-y-4">
          <ImagePicker
            files={files}
            onFilesChange={setFiles}
            maxFiles={room}
            progress={progress}
            disabled={uploading}
          />
          {files.length > 0 && !uploading && (
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="ghost" onClick={() => setFiles([])}>
                Clear
              </Button>
              <Button onClick={upload}>
                <Upload />
                Upload {files.length} photo{files.length === 1 ? "" : "s"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
          This is the most photos allowed. Remove one to add another.
        </p>
      )}
    </div>
  );
}
