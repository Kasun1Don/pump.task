"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

import { Button } from "@acme/ui/button";
import { Switch } from "@acme/ui/switch";

import { api } from "~/trpc/react";

const templates = [
  { id: "60d5f484f8d2e30d8c4e4b0a", name: "DevOps Pipeline Template" },
  { id: "60d5f484f8d2e30d8c4e4b0b", name: "Kanban Template" },
  { id: "60d5f484f8d2e30d8c4e4b0c", name: "Agile Sprint Board Template" },
];

export default function ProjectsPage() {
  const activeAccount = useActiveAccount();
  const [showOwnedOnly, _setShowOwnedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showFilter, setShowFilter] = useState("all");
  const router = useRouter();

  const walletId = activeAccount?.address ?? "";

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
  const filteredProjects = projects?.filter((project) => {
    if (showFilter === "all") return true;
    if (showFilter === "owned")
      return project.members.some(
        (member) => member.walletId === walletId && member.role === "Owner",
      );
    if (showFilter === "my")
      return project.members.some((member) => member.walletId === walletId);
    return true;
  });

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      setIsModalOpen(false);
      setNewProjectName("");
      setSelectedTemplate("");
      setIsPrivate(false);
      void refetchProjects();
    },
    onError: (error) => {
      console.error("Error creating project:", error);
    },
  });

  return (
    <>
      <div className="m-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="pl-8 pr-8">
              <h1 className="text-xl font-bold">Your Project Task Boards</h1>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-gray-700">
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
                  showFilter === "owned"
                    ? "bg-[#18181B] text-white"
                    : "bg-[#09090B] text-gray-400"
                } hover:bg-[#27272A]`}
                onClick={() => setShowFilter("owned")}
              >
                Created by me
              </button>
            </div>
            <div className="mr-8">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
              >
                + Create new project
              </Button>
            </div>
          </div>
          <div className="grid auto-rows-min grid-cols-3 gap-4 p-8">
            {filteredProjects?.map((project) => (
              <div
                key={project._id.toString()}
                className="flex min-h-32 cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-gray-700 bg-[#09090B] font-bold transition-colors hover:bg-[#18181B]"
                onClick={() => {
                  document.cookie = `projectId=${project._id.toString()}; path=/;`;
                  router.push(`/tasks?projectId=${project._id.toString()}`);
                  router.refresh();
                }}
              >
                <h3 className="p-4 text-white">{project.name}</h3>
                <p className="px-4 pb-4 text-sm text-gray-400">
                  {project.isPrivate ? "Private" : "Public"} project
                </p>
              </div>
            ))}
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
                key={template.id}
                className="min-h-32 overflow-hidden rounded-lg border border-gray-700 bg-[#18181B] font-bold"
              >
                <h3 className="p-4 text-center text-white">{template.name}</h3>
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
                    <option key={template.id} value={template.id}>
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
                    members: [{ user: walletId, role: "Owner" }],
                  });
                  createProject.mutate({
                    name: newProjectName,
                    isPrivate: isPrivate,
                    templateId: selectedTemplate || undefined,
                    members: [{ user: walletId, role: "Owner" }],
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
    </>
  );
}
