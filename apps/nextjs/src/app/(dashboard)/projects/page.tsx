"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@acme/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { toast } from "@acme/ui/toast";

import { CreateProjectDialog } from "~/app/_components/_projects/create-project-dialog";
import ProjectsSkeleton from "~/app/_components/_projects/projects-skeleton";
import { revalidate } from "~/app/actions/revalidate";
import { api } from "~/trpc/react";

export default function ProjectsPage() {
  const activeAccount = useActiveAccount();
  const [showOwnedOnly, _setShowOwnedOnly] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedProjectForBadges, setSelectedProjectForBadges] = useState<
    string | null
  >(null);
  const [showFilter, setShowFilter] = useState("all");
  const [_selectedTemplate, setSelectedTemplate] = useState("");
  const [projectsPerPage, setProjectsPerPage] = useState(3);
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

  // side-effect to set projects per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setProjectsPerPage(9);
      } else if (window.innerWidth >= 640) {
        // sm breakpoint
        setProjectsPerPage(6);
      } else {
        setProjectsPerPage(3);
      }
    };

    // initialize
    handleResize();
    // event listener
    window.addEventListener("resize", handleResize);
    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const {
    data: projects,
    refetch: refetchProjects,
    isLoading: isProjectsLoading,
  } = api.project.getAll.useQuery(
    {
      showOwnedOnly,
      userId: walletId,
    },
    {
      enabled: !!walletId, // Only run the query if we have a userId
    },
  );

  const user = api.user.byWallet.useSuspenseQuery({ walletId });
  const [userMemberships, { refetch: refetchMemberships }] =
    api.member.byUserId.useSuspenseQuery({
      userId: user[0]._id,
    });

  // TRPC utility function to invalidate cache data
  const utils = api.useUtils();

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);

  const updateProjectDescription = api.project.updateName.useMutation({
    onSuccess: () => {
      void refetchProjects();
      setIsEditModalOpen(false);
      setEditingProject(null);
    },
  });

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

  const leaveProject = api.member.removeSelf.useMutation({
    onSuccess: async () => {
      await Promise.all([refetchProjects(), refetchMemberships()]);
    },
    onError: (error) => {
      console.error("Error leaving project:", error);
    },
  });

  const { data: memberCounts } = api.member.getProjectMemberCounts.useQuery(
    projects?.map((p) => p._id.toString()) ?? [],
  );

  const { data: projectTags } = api.task.getProjectTags.useQuery(
    projects?.map((p) => p._id.toString()) ?? [],
  );

  return (
    <>
      <div className="m-8">
        <div>
          <div className="mb-6 flex flex-col items-center justify-between space-y-8 px-8 sm:flex-row sm:space-x-4 sm:space-y-0">
            <h1 className="text-xl font-bold">Your Project Task Boards</h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D] sm:w-auto"
            >
              + Create New Project
            </Button>
          </div>
          <div className="flex justify-center">
            <Tabs
              defaultValue="all"
              onValueChange={(value) => setShowFilter(value)}
              className="w-[500px]"
            >
              <TabsList className="grid w-full grid-cols-3 bg-[#18181B]">
                <TabsTrigger
                  value="all"
                  className="border-b border-l border-t px-4 py-2 text-base data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white"
                >
                  All Projects
                </TabsTrigger>
                <TabsTrigger
                  value="my"
                  className="border-b border-t px-4 py-2 text-base data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white"
                >
                  My Projects
                </TabsTrigger>
                <TabsTrigger
                  value="Owned"
                  className="border-b border-r border-t px-4 py-2 text-base data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white"
                >
                  Created By Me
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* change isProjectsLoading to true to force projects skeleton view */}
          {isProjectsLoading ? (
            <ProjectsSkeleton />
          ) : (
            <>
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                {currentProjects && currentProjects.length > 0 ? (
                  <>
                    {currentProjects.map((project) => {
                      const isOwner = userMemberships.some(
                        (member) =>
                          member.projectId === project._id.toString() &&
                          member.role === "Owner",
                      );

                      const isAdmin = userMemberships.some(
                        (member) =>
                          member.projectId === project._id.toString() &&
                          member.role === "Admin",
                      );

                      const isMember = userMemberships.some(
                        (member) => member.projectId === project._id.toString(),
                      );

                      const memberCount =
                        memberCounts?.[project._id.toString()] ?? 0;

                      // check if this project is the most recent active project (length of array minus 1)
                      const isActive = user[0].activeProjects?.length
                        ? user[0].activeProjects[
                            user[0].activeProjects.length - 1
                          ]?.toString() === project._id.toString()
                        : false;

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

                              // invalidate and refetch user data
                              await utils.user.byWallet.invalidate();

                              // Navigate to the project's tasks page
                              await revalidate("/");
                              router.push(`/tasks/${project._id.toString()}`);
                            } catch (error) {
                              console.error(
                                "Error updating active projects:",
                                error,
                              );
                            }
                          }}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger className="absolute right-2 top-2">
                              <Image
                                src="/VertDots.svg"
                                alt="Options"
                                width={2}
                                height={10}
                                className="mt-1 h-6 w-6 hover:brightness-50 hover:[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(86deg)_brightness(118%)_contrast(119%)]"
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {(isOwner || isAdmin) && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/users/${project._id.toString()}`,
                                    );
                                  }}
                                >
                                  View Users
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProjectForBadges(
                                    project._id.toString(),
                                  );
                                  setIsBadgeModalOpen(true);
                                }}
                              >
                                View Badges
                              </DropdownMenuItem>
                              {(isOwner || isAdmin) && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingProject({
                                      id: project._id.toString(),
                                      name: project.name,
                                      description: project.description,
                                    });
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  Edit Project Details
                                </DropdownMenuItem>
                              )}
                              {isMember && !isOwner && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.promise(
                                      new Promise((resolve) => {
                                        toast(
                                          "Are you sure you want to leave this project?",
                                          {
                                            action: {
                                              label: "Confirm",
                                              onClick: () => {
                                                leaveProject.mutate({
                                                  projectId:
                                                    project._id.toString(),
                                                  walletId: walletId,
                                                });
                                                resolve(true);
                                              },
                                            },
                                            cancel: {
                                              label: "Cancel",
                                              onClick: () => resolve(false),
                                            },
                                          },
                                        );
                                      }),
                                      {
                                        loading: "Leaving project...",
                                        success: "Successfully left project",
                                        error: "Failed to leave project",
                                      },
                                    );
                                  }}
                                  className="text-red-500"
                                >
                                  Leave Project
                                </DropdownMenuItem>
                              )}
                              {isOwner && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProjectToDelete(project._id.toString());
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="text-red-500"
                                >
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <h3 className="p-4 pr-8 text-white">
                            {project.name}
                            {isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-3 h-6 rounded-lg bg-white px-2 text-base text-black"
                              >
                                Active
                              </Button>
                            )}
                          </h3>
                          {project.description && (
                            <p className="px-4 pb-2 text-sm font-light text-gray-400">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between space-x-4 px-4 pb-4">
                            <div className="flex gap-4 text-sm text-gray-400">
                              <p>
                                {project.isPrivate ? "Private" : "Public"}{" "}
                                project
                              </p>
                              <p className="flex items-center whitespace-nowrap">
                                Available Badges:{" "}
                                <span className="inline-flex items-center gap-1">
                                  {projectTags?.[project._id.toString()]
                                    ?.length ?? 0}
                                  {/* only show badge icon if there are available badges */}
                                  {(projectTags?.[project._id.toString()]
                                    ?.length ?? 0) > 0 && (
                                    <Image
                                      src="/CheckoutVector.svg"
                                      alt="Badges"
                                      width={14}
                                      height={14}
                                      className="inline-block flex-shrink-0"
                                    />
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Image
                                src="/userIcon.png"
                                alt="Members"
                                width={16}
                                height={16}
                                className="opacity-60"
                              />
                              <span>{memberCount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="col-span-3 text-center text-gray-400">
                    <p>
                      {showFilter === "all"
                        ? "You are not associated with any projects yet."
                        : showFilter === "my"
                          ? "You are not a member of any projects."
                          : "You haven't created any projects yet."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* pagination only renders if there are more than 1 page of projects*/}
        {totalPages > 1 && (
          <div className="col-span-3 mb-3 flex justify-center p-4 sm:p-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
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

        <div>
          <div className="pl-8 pr-8">
            <h1 className="mb-4 text-xl font-bold">Task Board Templates</h1>
            <p className="font-bold">
              Start your project with a Pump.task template to start pumping
              through tasks faster:
            </p>
          </div>
          <div className="grid auto-rows-min grid-cols-1 gap-4 p-8 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template._id.toString()}
                className="min-h-32 cursor-pointer overflow-hidden rounded-lg border border-gray-700 bg-[#18181B] font-bold hover:bg-[#27272A]"
                onClick={() => {
                  setSelectedTemplate(template._id.toString());
                  setIsModalOpen(true);
                }}
              >
                <h3 className="p-4 text-center text-white">{template.name}</h3>
                <p className="px-3 text-center text-gray-400">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateProjectDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        walletId={walletId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleDelete();
            }
          }}
          tabIndex={0}
          role="alertdialog"
        >
          <DialogHeader>
            <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
            <DialogDescription id="delete-dialog-description">
              <p>Are you sure you want to remove this project?</p>
              <p>(This action cannot be undone)</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Press Enter to confirm or Escape to cancel
              </p>
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

      {/* Badge Display Modal */}
      <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Available Badges</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-4 p-4">
            {selectedProjectForBadges &&
              projectTags?.[selectedProjectForBadges]?.map((tag) => {
                // Remove spaces from tag name to match image filenames
                const imageTag = tag.replace(/\s+/g, "").toLowerCase();
                return (
                  <div key={tag} className="flex flex-col items-center">
                    <Image
                      src={`/nfts/${imageTag}.png`}
                      alt={tag}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <span className="mt-2 text-sm text-gray-400">{tag}</span>
                  </div>
                );
              })}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsBadgeModalOpen(false)}
              className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project Details</DialogTitle>
            <DialogDescription>
              Make changes to your project details here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <input
                type="text"
                maxLength={40}
                placeholder="Project Name"
                value={editingProject?.name ?? ""}
                onChange={(e) =>
                  setEditingProject((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                className="w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
              />
            </div>
            <div className="grid gap-2">
              <input
                type="text"
                placeholder="Description (optional, max 60 char)"
                maxLength={60}
                value={editingProject?.description ?? ""}
                onChange={(e) =>
                  setEditingProject((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
                className="w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingProject) {
                  updateProjectDescription.mutate({
                    projectId: editingProject.id,
                    name: editingProject.name,
                    description: editingProject.description,
                  });
                }
              }}
              className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
