const projects = [
  { id: 1, name: "CRM" }, // seed data
  { id: 2, name: "Dog Walkies" },
];

const templates = [
  { id: 1, name: "DevOps Pipeline Template" },
  { id: 2, name: "Kanban Template" },
  { id: 3, name: "Agile Sprint Board Template" },
];

// TODO: Task Board Templates, Your Task Boards, 
export default function ProjectsPage() {
  return (
    <>
    <div className="m-8">
      <div className="mb-8">
        <div className="pl-8 pr-8">
         <h1 className="text-xl font-bold">Your Project Task Boards</h1>
        </div>
        <div className="grid grid-cols-3 gap-4 p-8 auto-rows-min">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-lg bg-gray-700 min-h-32 font-bold">
              <h3 className="p-4 text-white">{project.name}</h3>
            </div>
          ))}
          <div className="flex items-center justify-center rounded-lg bg-gray-800 min-h-32">
            <h3 className="text-white">Create new project task board</h3>
          </div>
        </div>
      </div>
      <div>
        <div className="pl-8 pr-8">
         <h1 className="text-xl font-bold mb-4">Task Board Templates</h1>
         <p className="font-bold">Start your project with a Pump.task template to start pumping through tasks faster:</p>
        </div>
        <div className="grid grid-cols-3 gap-4 p-8 auto-rows-min">
          {templates.map((template) => (
            <div
              key={template.id}
              className="overflow-hidden rounded-lg bg-gray-700 min-h-32 font-bold">
              <h3 className="p-4 text-white text-center">{template.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
