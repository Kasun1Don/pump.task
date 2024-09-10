import Link from "next/link";

import { Button } from "@acme/ui/button"; //button from monorepo packages/ui

export default function NotFound() {
  return (
    <div className="bg-custom-bg flex h-screen items-center justify-center bg-cover bg-center">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold">404 Page not found</h1>
        <p className="text-xl">Couldn't find the requested resource</p>

        <Link href="/">
          {/* TODO: update button style to match the project design guide */}
          <Button className="mt-4 bg-[#72D524]" variant="link" size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
