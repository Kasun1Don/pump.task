import { NextResponse } from "next/server";

import { isLoggedIn } from "./app/actions/authFront";

export async function middleware(request: NextResponse) {
  if (!(await isLoggedIn())) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secure"],
};
