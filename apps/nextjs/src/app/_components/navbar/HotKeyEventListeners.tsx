"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HotKeyEventListeners() {
  const router = useRouter();

  // Function to handle key presses
  const handleKeyPress = (event: KeyboardEvent) => {
    // Check for Ctrl + P (for Profile)
    if (event.ctrlKey && event.key.toLowerCase() === "p") {
      event.preventDefault();
      console.log("Profile button pressed");

      router.push("/dashboard/profile");
    }

    // Check for Ctrl + s (for Settings)
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      event.preventDefault();
      console.log("Settings button pressed");
      router.push("/dashboard/settings");
    }

    // Logout for Ctrl + Shift + Q
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "q") {
      event.preventDefault();
      console.log("Logging out");
      // router.push("/dashboard/logout");
    }
  };

  // Add all events to for listen when component is mounted
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener when component is unmounted remove the events
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // This component doesn't render anything but still needs to return something
}
