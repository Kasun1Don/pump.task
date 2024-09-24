"use client";

import { createContext, useContext, useState } from "react";

interface CurrentProjectContextType {
  currentProject: string;
  setCurrentProject: (project: string) => void;
}

const defaultProject = "default project";

// Create context with the default value
const CurrentProjectContext = createContext<CurrentProjectContextType>({
  currentProject: defaultProject,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentProject: () => {},
});

/**
 * @author Benjamin Davies
 *
 * @description
 * This component provides the current project context state and makes it available to all the children to the children components.
 *
 * @returns
 * The CurrentProjectProvider component that provides the current project context to the children components.
 */
export const CurrentProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentProject, setCurrentProject] = useState<string>(defaultProject);

  return (
    <CurrentProjectContext.Provider
      value={{ currentProject, setCurrentProject }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
};

export const useCurrentProject = () => {
  return useContext(CurrentProjectContext);
};
