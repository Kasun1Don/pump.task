const projects = [
  { id: 1, name: "Maker DAO" }, // replace with correct paths
  { id: 2, name: "Algorand" },
  { id: 3, name: "Immutable" },
];

const templates = [
  { id: 1, name: "DevOps Pipeline Template" },
  { id: 2, name: "Kanban Template" },
  { id: 3, name: "Agile Sprint Board Template" },
];

// TODO: card fills with related images + UI adjustments
export default function ProjectsPage() {
  return (
    <>
      <div className="m-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="pl-8 pr-8">
              <h1 className="text-xl font-bold">Your Project Task Boards</h1>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-gray-700">
              <button className="bg-[#18181B] px-4 py-2 font-semibold text-white hover:bg-[#27272A]">
                All projects
              </button>
              <button className="bg-[#09090B] px-4 py-2 font-semibold text-gray-400 hover:bg-[#18181B]">
                Created by me
              </button>
            </div>
            <div className="mr-8 flex items-center justify-center rounded-lg border border-gray-700 bg-[#72D524] p-1 font-bold hover:bg-[#5CAB1D]">
              <h3 className="text-[#18181B]"> + Create new project </h3>
            </div>
          </div>
          <div className="grid auto-rows-min grid-cols-3 gap-4 p-8">
            {projects.map((project) => (
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
    </>
  );
}
