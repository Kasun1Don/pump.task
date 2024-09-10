"use client";

import { api } from "~/trpc/react";

export default function DashboardPage() {
  const users = api.user.all.useQuery();

  console.log(users);
  return (
    <div>
      <h1>Dashboard / Home Page</h1>
    </div>
  );
}
