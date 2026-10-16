// Multipart upload that reports progress (ofetch/fetch can't), against the same-origin /api/v1 proxy.
// A 401 refreshes the session once and retries, like apiClient does.

interface UploadResult<T> {
  status: number;
  body: T;
}

export class UploadError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function send<T>(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<UploadResult<T>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.response as T });
    xhr.onerror = () =>
      reject(new UploadError("Network error. Please try again", 0));
    xhr.send(formData);
  });
}

export async function uploadWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<T> {
  const url = `/api/v1${path}`;
  let result = await send<T>(url, formData, onProgress);

  if (result.status === 401) {
    const refreshed = await fetch("/api/v1/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      onProgress(0);
      result = await send<T>(url, formData, onProgress);
    }
  }

  if (result.status < 200 || result.status >= 300) {
    const message =
      (result.body as { message?: string } | null)?.message ??
      "Upload failed. Please try again";
    throw new UploadError(message, result.status);
  }

  return result.body;
}
