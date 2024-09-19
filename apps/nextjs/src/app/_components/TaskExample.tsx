"use client";

import { useCurrentProject } from "~/app/context/CurrentProjectProvider";

export default function Task() {
  const { currentProject } = useCurrentProject();

  return (
    <div>
      <h1>Current Project: {currentProject}</h1>
    </div>
  );
}
