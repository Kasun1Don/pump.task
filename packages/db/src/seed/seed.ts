export const templateSeed = [
    {
      name: "DevOps Pipeline Template",
      description: "Ideal for managing DevOps pipelines",
      statusColumns: [
        { name: "Backlog", order: 0, isProtected: true },
        { name: "Planned", order: 1, isProtected: false },
        { name: "In Development", order: 2, isProtected: false },
        { name: "In Testing", order: 3, isProtected: false },
        { name: "Deployed", order: 4, isProtected: true },
      ],
    },
    {
      name: "Kanban Template",
      description: "Traditional Kanban board layout",
      statusColumns: [
        { name: "Requested", order: 0, isProtected: true },
        { name: "In Progress", order: 1, isProtected: false },
        { name: "Testing", order: 2, isProtected: false },
        { name: "Complete", order: 3, isProtected: true },
      ],
    },
    {
      name: "Agile Sprint Board Template",
      description: "Agile sprint board for managing tasks within a sprint",
      statusColumns: [
        { name: "Backlog", order: 0, isProtected: true },
        { name: "Sprint Planning", order: 1, isProtected: false },
        { name: "In Progress", order: 2, isProtected: false },
        { name: "Review", order: 3, isProtected: false },
        { name: "Done", order: 4, isProtected: true },
      ],
    },
  ];