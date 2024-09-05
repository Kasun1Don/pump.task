
const projects = [
  { id: 1, name: "CRM", image: "/images/crm.jpg" }, // replace with correct paths
  { id: 2, name: "Dog Walkies", image: "/images/dog-walkies.jpg" },
];

export default function ProjectsPage() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-700 rounded-lg overflow-hidden">
          <h3 className="text-white p-4">{project.name}</h3>
        </div>
      ))}
      <div className="bg-gray-800 rounded-lg flex items-center justify-center">
        <h3 className="text-white">Create new board</h3>
      </div>
    </div>
  );
}