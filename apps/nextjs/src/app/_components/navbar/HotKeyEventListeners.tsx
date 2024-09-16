"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

/**
 * @author Benjamin Davies
 * @description HotKeyEventListeners component to listen for key presses when the user has signed into there account, additional hotkeys can be added here also has some, At the moment both hotkeys for Mac and Windows are the truthy is dosent matter if the user is on a Mac and presses Ctrl instead of Command it will still work and vise versa.
 *
 * @returns Null because it doesn't render anything
 */
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
    if (
      event.shiftKey &&
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "p"
    ) {
      event.preventDefault();
      router.push("/dashboard/profile");
    }

    // Check for Command + S (for Settings)
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      router.push("/dashboard/settings");
    }

    // Logout for Shift + Q
    if (
      (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === "q") ||
      (event.shiftKey && event.key.toLowerCase() === "q")
    ) {
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
