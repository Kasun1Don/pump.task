// Import React and Next.js modules
import type { ReactNode } from "react";

import Navbar from "../_components/_navbar/Navbar";

/**
 * @author Benjamin davies
 *
 * @description
 * This component is used to create the Layout component that is used in the Dashboard. The Layout component is used to create the Navbar. The Layout component is used to wrap the content of the Dashboard and provide a consistent layout for all children routes.
 *
 *
 * @returns The Layout Component including the Navbar and the children components.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-custom-bg bg-cover bg-center">
        <Navbar />
        <main className="h-[calc(100vh-8rem)] pt-32">{children}</main>
      </div>
    </>
  );
}
