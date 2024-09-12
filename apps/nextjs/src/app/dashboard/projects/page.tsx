"use client";

import { useState } from "react";

// import { api } from "~/trpc/react"; // sets up the tRPC client for React components

const projects = [
  { id: 1, name: "Maker DAO", owner: false },
  { id: 2, name: "Algorand", owner: false },
  { id: 3, name: "Immutable", owner: true },
];

const templates = [
  { id: 1, name: "DevOps Pipeline Template" },
  { id: 2, name: "Kanban Template" },
  { id: 3, name: "Agile Sprint Board Template" },
];

// TODO: card fills with related images + UI adjustments
export default function ProjectsPage() {
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const filteredProjects = showOwnedOnly
    ? projects.filter((project) => project.owner)
    : projects;

  // const createProject = api.project.create.useMutation({
  //   onSuccess: () => {
  //     setIsModalOpen(false);
  //     setNewProjectName("");
  //     // setSelectedTemplate("");
  //   },
  // });

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
                  !showOwnedOnly
                    ? "bg-[#18181B] text-white"
                    : "bg-[#09090B] text-gray-400"
                } hover:bg-[#27272A]`}
                onClick={() => setShowOwnedOnly(false)}
              >
                All projects
              </button>
              <button
                className={`px-4 py-2 font-semibold ${
                  showOwnedOnly
                    ? "bg-[#18181B] text-white"
                    : "bg-[#09090B] text-gray-400"
                } hover:bg-[#27272A]`}
                onClick={() => setShowOwnedOnly(true)}
              >
                Created by me
              </button>
            </div>
            <div className="mr-8 flex items-center justify-center rounded-lg border border-gray-700 bg-[#72D524] p-1 font-bold hover:bg-[#5CAB1D]">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[#18181B]"
              >
                + Create new project
              </button>
            </div>
          </div>
          <div className="grid auto-rows-min grid-cols-3 gap-4 p-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex min-h-32 flex-col justify-between overflow-hidden rounded-lg border border-gray-700 bg-[#09090B] font-bold"
              >
                <h3 className="p-4 text-white">{project.name}</h3>
                <p className="px-4 pb-4 text-sm text-gray-400">
                  2 tasks assigned to you &nbsp;&nbsp;&nbsp;&nbsp; 8 badges
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
            <h2 className="mb-4 text-xl font-bold text-white">
              Create New Project
            </h2>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
            />
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-700 bg-[#09090B] p-2 text-white"
            >
              <option value="">Select a template (optional)</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                // onClick={() => {
                //   // project creation logic
                //   createProject.mutate({
                //     name: newProjectName,
                //     isPrivate: false, // TODO: add option for this in the form
                //     // templateId: selectedTemplate || undefined,
                //   });
                // }}
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
