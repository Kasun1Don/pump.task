// import type { NextRouter } from "next/router";

// import { api } from "~/trpc/server"; // Ensure this imports the correct tRPC client

// // Custom hook for updating active projects
// export const useUpdateActiveProjects = () => {
//   const updateActiveProjectsMutation =
//     api.user.updateActiveProjects.useMutation();

//   const updateActiveProjects = async (
//     projectId: string,
//     walletId: string,
//     router: NextRouter,
//   ) => {
//     if (!walletId) {
//       console.error("No walletId found for the current user.");
//       return;
//     }

//     try {
//       // Call the mutation to update active projects
//       await updateActiveProjectsMutation.mutateAsync({
//         projectId,
//         walletId,
//       });

//       // On success, navigate to the project page
//       router.push(`/tasks/${projectId}`);
//       router.refresh(); // Optionally refresh the page
//     } catch (error) {
//       console.error("Error updating active projects:", error);
//     }
//   };

//   return {
//     updateActiveProjects,
//     isLoading: updateActiveProjectsMutation.isLoading,
//     isError: updateActiveProjectsMutation.isError,
//     error: updateActiveProjectsMutation.error,
//   };
// };
