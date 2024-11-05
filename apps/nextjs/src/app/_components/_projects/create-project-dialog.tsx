"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { Switch } from "@acme/ui/switch";

import { revalidate } from "~/app/actions/revalidate";
import { api } from "~/trpc/react";

interface CreateProjectDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  walletId: string;
}

export function CreateProjectDialog({
  isModalOpen,
  setIsModalOpen,
  walletId,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState("");

  const { data: templates = [] } = api.template.getAll.useQuery();

  const createProject = api.project.create.useMutation({
    onSuccess: async (newProject) => {
      handleCloseModal();
      // Update active projects
      await updateActiveProjectsMutation.mutateAsync({
        walletId: walletId,
        projectId: newProject.id.toString(),
      });
      await revalidate("/");
      router.push(`/tasks/${newProject.id.toString()}`);
    },
  });

  const updateActiveProjectsMutation =
    api.user.updateActiveProjects.useMutation({
      onSuccess: (data) => {
        console.log("Active projects updated:", data.activeProjects);
      },
      onError: (error) => {
        console.error("Error updating active projects:", error);
      },
    });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewProjectName("");
    setSelectedTemplate("");
    setIsPrivate(false);
    setDescription("");
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-96 border-gray-700 bg-[#18181B]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={40}
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description (optional, max 60 char)"
              maxLength={60}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <div className="flex items-center justify-between px-2">
            <span className="text-white">Private Project</span>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              className="border border-gray-700 data-[state=checked]:bg-[#72D524]"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
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
                description: description || undefined,
                userMemberships: [{ user: walletId, role: "Owner" }],
              });
              createProject.mutate({
                name: newProjectName,
                isPrivate: isPrivate,
                templateId: selectedTemplate || undefined,
                description: description || undefined,
                members: { user: walletId, role: "Owner" },
              });
            }}
            className="rounded-lg bg-[#72D524] px-4 py-2 pb-2 text-[#18181B] hover:bg-[#5CAB1D] sm:pb-0"
          >
            Create
          </button>
          <button
            onClick={handleCloseModal}
            className="mr-2 rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
