import { createCaller, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";

// Function to create and return the tRPC caller this is required for server side fetching of data
export async function createServerSideFetch() {
  // Create the tRPC context this grabs the authenticated user session and allows us to set any headers if we want.
  const context = await createTRPCContext({
    session: await auth(),
    headers: new Headers(),
  });

  // Create and return the caller with the provided context
  return createCaller(context);
}
