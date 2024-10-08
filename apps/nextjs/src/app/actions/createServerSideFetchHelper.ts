import { cookies } from "next/headers";

import { createCaller, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";

/**
 * @author Benjmain Daviess
 * @description
 * This function is used to create a server-side tRPC caller. It handles the creation of the context
 * and the authentication process required for fetching data from a server side component.
 *
 * Key Steps:
 *
 * 1. **tRPC Context Creation**:
 *    - The `createTRPCContext` function is used to generate the context required for tRPC calls. This includes
 *      authentication and session handling, as well as any relevant headers.
 *
 * 2. **Authentication**:
 *    - The `auth()` function is used to fetch the current authenticated user session token.
 *
 * 3. **Headers**:
 *    - If any additional headers are needed, (this could a JWT or something to identify the user) they can be added to the `headers`
 *
 * 4. **Returning the Caller**:
 *    - The `createCaller` function is called with the tRPC context to create and return the tRPC caller. This caller
 *      is then used to make API requests directly to your backend from the server-side.
 *
 * 5. **Usage**:
 *    - The caller returned by this function can be used to fetch any server-side data via tRPC calls. You would typically
 *      call methods on this caller (e.g., `caller.user.all()`), just type "caller." and you will see all the available methods.
 *
 *
 * @returns {Promise<ReturnType<typeof createCaller>>} A Promise that resolves to the tRPC caller.
 */
export async function createServerSideFetch(): Promise<
  ReturnType<typeof createCaller>
> {
  // Retrieve the JWT from the cookies
  const jwt = cookies().get("jwt")?.value;

  // Create headers and add the JWT if it exists
  const headers = new Headers();
  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  // Create the tRPC context (grabs the authenticated user session, allows setting headers if needed)
  const context = await createTRPCContext({
    session: await auth(),
    headers,
  });

  return createCaller(context);
}