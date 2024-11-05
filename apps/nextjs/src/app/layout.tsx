import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";
import { api } from "~/trpc/server";

import "~/app/globals.css";

import { headers } from "next/headers";

import { ThirdwebProvider } from "~/app/thirdweb";
import { env } from "~/env";
import { revalidate } from "./actions/revalidate";

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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname");
  if (
    pathname?.split("/")[1] === "users" ||
    pathname?.split("/")[1] === "tasks"
  ) {
    const id = pathname.split("/")[2];
    const walletId: string = cookies().get("wallet")?.value ?? "";
    const user = await api.user.byWallet({ walletId });
    if (user.activeProjects !== undefined && id) {
      if (user.activeProjects.at(-1)?.toString() !== id) {
        try {
          await api.user.updateActiveProjects({
            walletId,
            projectId: id,
          });
        } catch {
          console.log("Not a member");
        }
        await revalidate("/");
      }
    }
  }
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
