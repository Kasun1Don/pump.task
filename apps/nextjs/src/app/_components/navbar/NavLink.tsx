"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex h-12 w-32 items-center justify-center text-center text-lg text-slate-500 hover:text-slate-50 ${
        isActive ? "border-b-2 border-white text-slate-50" : ""
      }`}
    >
      <h2
        className={`mb-1 w-full items-center rounded-md px-2 py-1 text-base font-medium outline-none transition-colors ${
          isActive
            ? "cursor-default bg-none text-inherit"
            : "hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        }`}
      >
        {children}
      </h2>
    </Link>
  );
}
