"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@acme/ui/pagination";
import { Switch } from "@acme/ui/switch";

import TrashIcon from "~/app/_components/_task/icons/TrashIcon";
import { revalidate } from "~/app/actions/revalidate";
import { api } from "~/trpc/react";

export default function ProjectsPage() {
  const activeAccount = useActiveAccount();
  const [showOwnedOnly, _setShowOwnedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showFilter, setShowFilter] = useState("all");
  const router = useRouter();

  // Modified wallet ID retrieval with cookie fallback
  const [walletId2, setWalletId] = useState<string>("");
  console.log(walletId2);
  const cookieWallet = document.cookie
    .split("; ")
    .find((row) => row.startsWith("wallet="))
    ?.split("=")[1];
  const walletId = cookieWallet ?? "";

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // number of projects per page
  const projectsPerPage = 9;

  useEffect(() => {
    // Try to get wallet from activeAccount first
    if (activeAccount?.address) {
      setWalletId(activeAccount.address);
    } else {
      // Fallback to cookie if activeAccount is not available
      const cookieWallet = document.cookie
        .split("; ")
        .find((row) => row.startsWith("wallet="))
        ?.split("=")[1];

      if (cookieWallet) {
        setWalletId(cookieWallet);
      }
    }
  }, [activeAccount]);

  useEffect(() => {
    console.log("Current user ID (wallet address):", walletId);
  }, [walletId]);

  const { data: projects, refetch: refetchProjects } =
    api.project.getAll.useQuery(
      {
        showOwnedOnly,
        userId: walletId,
      },
      {
        enabled: !!walletId, // Only run the query if we have a userId
      },
    );

  const user = api.user.byWallet.useSuspenseQuery({ walletId });
  const [userMemberships] = api.member.byUserId.useSuspenseQuery({
    userId: user[0]._id,
  });

  const filteredProjects = projects
    ?.filter((project) => {
      if (showFilter === "all") {
        // Don't show private projects in "all" view
        return !project.isPrivate;
      }
      if (showFilter === "Owned") {
        return userMemberships.some(
          (member) =>
            member.projectId === project._id.toString() &&
            member.role === "Owner",
        );
      }
      if (showFilter === "my") {
        return userMemberships.some(
          (member) => member.projectId === project._id.toString(),
        );
      }
      return true;
    })
    .reverse(); // reverse here shows newest first

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredProjects?.length ?? 0) / projectsPerPage,
  );
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects?.slice(startIndex, endIndex);

  // function to generate page numbers for pagination
  const generatePaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return items;
  };

  const createProject = api.project.create.useMutation({
    onSuccess: async (newProject) => {
      setIsModalOpen(false);
      setNewProjectName("");
      setSelectedTemplate("");
      setIsPrivate(false);
      document.cookie = `projectId=${newProject.id}; path=/;`;
      await revalidate("/");
      router.push(`/tasks/${newProject.id.toString()}`);
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      console.log("Project deleted successfully");
      void refetchProjects();
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });

  const handleDelete = () => {
    if (projectToDelete) {
      deleteProject.mutate({ projectId: projectToDelete });
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  // Initialize the mutation
  const updateActiveProjectsMutation =
    api.user.updateActiveProjects.useMutation({
      onSuccess: (data) => {
        console.log("Active projects updated:", data.activeProjects);
      },
      onError: (error) => {
        console.error("Error updating active projects:", error);
        // Optionally, display an error message to the user
      },
    });

  // fetch templates
  const { data: templates = [] } = api.template.getAll.useQuery();

  return (
    <>
      <div className="m-8">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between px-8">
            <h1 className="text-xl font-bold">Your Project Task Boards</h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
            >
              + Create new project
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <button
                className={`px-4 py-2 font-semibold ${
                  showFilter === "all"
                    ? "bg-[#18181B] text-white"
                    : "bg-[#09090B] text-gray-400"
                } hover:bg-[#27272A]`}
                onClick={() => setShowFilter("all")}
              >
                All projects
              </button>
              <button
                className={`px-4 py-2 font-semibold ${
                  showFilter === "my"
                    ? "bg-[#18181B] text-white"
                    : "bg-[#09090B] text-gray-400"
                } hover:bg-[#27272A]`}
                onClick={() => setShowFilter("my")}
              >
                My projects
              </button>
              <button
                className={`px-4 py-2 font-semibold ${
                  showFilter === "Owned"
                    ? "bg-[#18181B] text-white"
                    : "bg-[#09090B] text-gray-400"
                } hover:bg-[#27272A]`}
                onClick={() => setShowFilter("Owned")}
              >
                Created by me
              </button>
            </div>
          </div>
          <div className="grid auto-rows-min grid-cols-3 gap-4 p-8">
            {currentProjects && currentProjects.length > 0 ? (
              <>
                {currentProjects.map((project) => {
                  const isOwner = userMemberships.some(
                    (member) =>
                      member.projectId === project._id.toString() &&
                      member.role === "Owner",
                  );

                  return (
                    <div
                      key={project._id.toString()}
                      className="group relative flex min-h-32 cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-gray-700 bg-[#09090B] font-bold transition-colors hover:bg-[#18181B]"
                      onClick={async () => {
                        try {
                          // Update active projects
                          await updateActiveProjectsMutation.mutateAsync({
                            walletId: walletId,
                            projectId: project._id.toString(),
                          });

                          // Set the cookie
                          document.cookie = `projectId=${project._id.toString()}; path=/;`;

                          // Navigate to the project's tasks page
                          await revalidate("/");
                          router.push(`/tasks/${project._id.toString()}`);
                        } catch (error) {
                          console.error(
                            "Error updating active projects:",
                            error,
                          );
                          // Optionally, display an error message to the user
                        }
                        //document.cookie = `projectId=${project._id.toString()}; path=/;`;
                        //router.push(`/tasks/${project._id.toString()}`);
                        // router.refresh();
                      }}
                    >
                      {isOwner && (
                        <button
                          className="absolute right-2 top-2 stroke-gray-500 opacity-0 transition-opacity duration-700 hover:stroke-rose-500 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete(project._id.toString());
                            setIsDeleteModalOpen(true);
                          }}
                          aria-label="Delete Project"
                        >
                          <TrashIcon />
                        </button>
                      )}
                      <h3 className="p-4 text-white">{project.name}</h3>
                      <p className="px-4 pb-4 text-sm text-gray-400">
                        {project.isPrivate ? "Private" : "Public"} project
                      </p>
                    </div>
                  );
                })}
                {/* pagination only renders if there are more than 1 page of projects*/}
                {totalPages > 1 && (
                  <div className="col-span-3 mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {generatePaginationItems()}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="col-span-3 text-center text-gray-400">
                <p className="mb-4">No projects found.</p>
                <p>
                  {showFilter === "all"
                    ? "You are not associated with any projects yet."
                    : showFilter === "my"
                      ? "You are not a member of any projects."
                      : "You haven't created any projects yet."}
                </p>
                <p className="mt-4">
                  Click the "Create new project" button to get started!
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="pl-8 pr-8">
            <h1 className="mb-4 text-xl font-bold">Task Board Templates</h1>
            <p className="font-bold">
              Start your project with a Pump.task template to start pumping
              through tasks faster:
            </p>
          </div>
          <div className="grid auto-rows-min grid-cols-3 gap-4 p-8">
            {templates.map((template) => (
              <div
                key={template._id.toString()}
                className="min-h-32 overflow-hidden rounded-lg border border-gray-700 bg-[#18181B] font-bold"
              >
                <h3 className="p-4 text-center text-white">{template.name}</h3>
                <p className="px-4 text-sm text-gray-400">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-[#18181B] p-6">
            <h2 className="mb-6 text-xl font-bold text-white">
              Create New Project
            </h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
                />
              </div>
              <div>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
                >
                  <option value="">Select a template (optional)</option>
                  {templates.map((template) => (
                    <option
                      key={template._id.toString()}
                      value={template._id.toString()}
                    >
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Private Project</span>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  className="data-[state=checked]:bg-[#72D524]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!walletId) {
                    console.error("No active account found");
                    return;
                  }
                  console.log("Attempting to create project with:", {
                    name: newProjectName,
                    isPrivate: isPrivate,
                    templateId: selectedTemplate || undefined,
                    userMemberships: [{ user: walletId, role: "Owner" }],
                  });
                  createProject.mutate({
                    name: newProjectName,
                    isPrivate: isPrivate,
                    templateId: selectedTemplate || undefined,
                    members: { user: walletId, role: "Owner" },
                  });
                }}
                className="rounded-lg bg-[#72D524] px-4 py-2 text-[#18181B] hover:bg-[#5CAB1D]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              <p>Are you sure you want to remove this project?</p>
              <p>(This action cannot be undone)</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
