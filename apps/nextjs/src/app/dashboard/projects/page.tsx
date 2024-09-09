const projects = [
  { id: 1, name: "CRM" }, // seed data
  { id: 2, name: "Dog Walkies App" },
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
          <div className="pl-8 pr-8">
            <h1 className="text-xl font-bold">Your Project Task Boards</h1>
          </div>
          <div className="grid auto-rows-min grid-cols-3 gap-4 p-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="min-h-32 overflow-hidden rounded-lg bg-[#09090B] font-bold border border-gray-700"
              >
                <h3 className="p-4 text-white">{project.name}</h3>
              </div>
            ))}
            <div className="flex min-h-32 items-center justify-center rounded-lg bg-[#72D524] border border-gray-700">
              <h3 className="text-[#18181B]">Create new task board</h3>
            </div>
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
                className="min-h-32 overflow-hidden rounded-lg bg-[#18181B] font-bold border border-gray-700"
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
