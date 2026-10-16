"use client";

import "./globals.css";

// Replaces the root layout when it fails, so it renders its own <html> and can't rely on providers
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground antialiased">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            The app couldn't load. Please try again in a moment.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="h-14 rounded-xl bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
            {/* A full page load, since the client router may be what broke */}
            <a
              href="/"
              className="flex h-14 items-center rounded-xl border px-6 font-medium hover:bg-muted"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
