"use client";

// Import the required libraries
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the Props interface
interface NavLinkProps {
  href: string;
  children: ReactNode;
}

/**
 * @author Benjamin davies
 *
 * @description
 * This component is used to create a NavLink component that is used in the Navbar. The usePathname hook is used to get the current pathname and compare it to the href prop to determine if the NavLink is active. If the NavLink is active, it will be styled differently compared to an inactive navlink.
 *
 * @param {NavLinkProps} { href }
 * @returns Navlink Component
 */
export default function NavLink({ href, children }: NavLinkProps) {
  // Get the current pathname
  const pathname = usePathname();

  // Check if the NavLink is active by comparing the pathname to the href
  const isActive = pathname === href;

  return (
    // Navtive Link border - background
    <Link
      href={href}
      className={`flex h-12 w-32 items-center justify-center text-center text-lg text-slate-500 hover:text-slate-50 ${
        isActive ? "border-b-2 border-white text-slate-50" : ""
      }`}
    >
      {/* Text and Hover effects */}
      <h2
        className={`mb-1 w-full items-center rounded-md px-2 py-1 text-base font-medium outline-none transition-colors ${
          isActive
            ? "cursor-default bg-none text-accent-foreground"
            : "hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        }`}
      >
        {children}
      </h2>
    </Link>
  );
}
