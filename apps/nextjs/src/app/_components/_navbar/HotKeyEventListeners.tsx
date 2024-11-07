"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

import { logout } from "~/app/actions/authFront";

/**
 * @author Benjamin Davies
 * @description HotKeyEventListeners component to listen for key presses when the user has signed into there account, additional hotkeys can be added here also, At the moment both hotkeys for Mac and Windows are the truthy is dosent matter if the user is on a Mac and presses Ctrl instead of Command it will still work and vise versa.
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
      disconnect(wallet);
      logout()
        .then(() => {
          router.push("/");
        })
        .catch((err) => console.log(err));
    } else {
      logout()
        .then(() => {
          router.push("/");
        })
        .catch((err) => console.log(err));
    }
  };

  // Function to handle key presses
  const handleKeyPress = (event: KeyboardEvent) => {
    // Check for Shift + Command + P (for Profile)
    if (
      // Mac
      (event.shiftKey && event.metaKey && event.key.toLowerCase() === "p") ||
      // Windows
      (event.ctrlKey && event.key.toLowerCase() === "p")
    ) {
      event.preventDefault();
      router.push("/profile");
    }

    // Check for Command + S (for Settings)
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      router.push("/settings");
    }

    // Logout for Shift + Q
    if (
      // Windows
      (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === "q") ||
      // Mac
      (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === "q")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // This component doesn't render anything but still needs to return something
}
