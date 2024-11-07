"use client";

import { Button } from "@acme/ui/button";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    // global-error Page
    <html>
      <body>
        <div className="bg-custom-bg flex h-screen flex-col items-center justify-center gap-8 bg-cover bg-center text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Sorry something went wrong!
          </h1>
          <p className="text-xl text-white">500 Internal Server Error</p>

          <Button
            className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
            onClick={() => reset()}
          >
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
