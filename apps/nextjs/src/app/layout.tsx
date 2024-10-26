import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { ThirdwebProvider } from "~/app/thirdweb";
import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "pump.task",
  icons: {
    icon: "/favicon.png",
  },
  description: "Project management with integrated web3 features",
  openGraph: {
    title: "pump.task",
    description: "Project management with integrated web3 features",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "pump.task",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@jullerino",
  //   creator: "@jullerino",
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThirdwebProvider>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
          </ThirdwebProvider>
          {/* <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
