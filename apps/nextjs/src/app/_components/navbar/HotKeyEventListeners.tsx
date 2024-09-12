/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

export default function HotKeyEventListeners() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  // Function to handle logout and disconnect wallet
  const handleLogout = () => {
    if (wallet) {
      // Disconnect the wallet
      disconnect(wallet);
    }

    // Delete JWT cookie (client-side cookie deletion is handled via document.cookie as next/headers doesn't is not supported in client components)
    // Set the cookie to randomly expire in the past      The path is set to root to ensure the cookie is deleted from all paths
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    // Navigate to home page
    router.push("/");
  };

  // Function to handle key presses
  const handleKeyPress = (event: KeyboardEvent) => {
    // Check for Shift + Command + P (for Profile)
    if (event.shiftKey && event.metaKey && event.key.toLowerCase() === "p") {
      event.preventDefault();
      router.push("/dashboard/profile");
    }

    // Check for Command + S (for Settings)
    if (event.metaKey && event.key.toLowerCase() === "s") {
      event.preventDefault();
      router.push("/dashboard/settings");
    }

    // Logout for Shift + Q
    if (event.shiftKey && event.key.toLowerCase() === "q") {
      event.preventDefault();
      try {
        handleLogout();
      } catch (error) {
        console.error("Error logging out", error);
      }
    }
  };

  // Add all events to listen when the component is mounted
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return null; // This component doesn't render anything but still needs to return something
}
