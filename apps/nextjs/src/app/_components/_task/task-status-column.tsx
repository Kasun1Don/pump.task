import type { z } from "zod";
import { useEffect, useState } from "react";

import type { ObjectIdString } from "@acme/validators";
import { TaskCardSchema } from "@acme/validators";

import { api } from "~/trpc/react";
import NewTaskCard from "./new-task-card";
import TaskCard from "./task-card";

type TaskCardData = z.infer<typeof TaskCardSchema>;

interface TaskStatusColumnProps {
  // task: TaskCardData;
  statusName: string;
  projectId: ObjectIdString;
  statusId: ObjectIdString;
}

const TaskStatusColumn = ({
  // task,
  statusName,
  projectId,
  statusId,
}: TaskStatusColumnProps) => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  // const [validationError, setValidationError] = useState<string | null>(null);
  console.log("task-status-column: statusId:", statusId);

  // Retrieve tasks
  const {
    data: taskData,
    // error,
    // isLoading,
  } = api.task.getTaskByStatusId.useQuery(
    {
      statusId: statusId,
    },
    {
      enabled: Boolean(statusId), // Only run query if projectId is valid
    },
  );

  useEffect(() => {
    if (taskData) {
      console.log(taskData);
      const validationResult = TaskCardSchema.array().safeParse(taskData);

      if (validationResult.success) {
        setTasks(validationResult.data);
      } else {
        console.error("Validation error:", validationResult.error.errors);
      }
    }
  }, [taskData]);

  return (
    <div className="bg-transparent-[16] flex w-fit flex-col gap-5 rounded-lg bg-[#00000029] p-5">
      <h2 className="flex justify-center text-lg font-extrabold">
        {statusName}
      </h2>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          projectId={projectId}
          statusId={statusId}
          task={task}
        />
      ))}
      <NewTaskCard statusId={statusId} projectId={projectId} />
    </div>
  );
};

export default TaskStatusColumn;
