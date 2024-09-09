const projects = [
  { id: 1, name: "CRM" }, // seed data
  { id: 2, name: "Dog Walkies" },
];

const templates = [
  { id: 1, name: "CRM" }, // seed data
  { id: 2, name: "Dog Walkies" },
];


// TODO: Task Board Templates, Your Task Boards, start pumping out tasks faster for your next projectwith a pump.task board template:
export default function ProjectsPage() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      <div className="flex items-center justify-center rounded-lg bg-gray-800">

      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          className="overflow-hidden rounded-lg bg-gray-700"
        >
          <h3 className="p-4 text-white">{project.name}</h3>
        </div>
      ))}
      <div className="flex items-center justify-center rounded-lg bg-gray-800">
        <h3 className="text-white">Create new task board project</h3>
      </div>
    </div>
  );
}
