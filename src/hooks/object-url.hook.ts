import { useEffect, useState } from "react";

// Preview URLs for local files (pass a stable array: a new one each render re-creates them), created and freed in the same effect so a re-run can't leave a revoked URL behind
export function useObjectUrls(files: File[]) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    setUrls(next);
    return () => {
      for (const url of next) URL.revokeObjectURL(url);
    };
  }, [files]);

  return urls;
}
