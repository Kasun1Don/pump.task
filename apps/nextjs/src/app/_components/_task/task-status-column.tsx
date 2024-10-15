import { useEffect, useState } from "react";

import type {
  ObjectIdString,
  TaskCard as TaskCardData,
} from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { TaskCardSchema } from "@acme/validators";

import { api } from "~/trpc/react";
import TrashIcon from "./icons/TrashIcon";
import NewTaskCard from "./new-task-card";
import TaskCard from "./task-card";

// type TaskCardData = z.infer<typeof TaskCardSchema>;

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Retrieve tasks
  const { data: taskData } = api.task.getTaskByStatusId.useQuery(
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

  const utils = api.useUtils();

  // Function to handle new task's created
  const handleTaskCreated = (newTask: TaskCardData) => {
    if (newTask.statusId === statusId) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  // Deletion mutation for the status column
  const deleteStatusColumn = api.task.deleteStatusColumn.useMutation({
    onSuccess: () => {
      console.log("Status column deleted successfully");
      void utils.task.getTaskByStatusId.invalidate(); // Invalidate tasks and refresh data
      void utils.task.getStatusesByProjectId.invalidate();
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Error deleting status column:", error.message);
      } else {
        console.error("Unknown error deleting status column");
      }
    },
  });

  // Handle deleting status column
  const handleDeleteColumn = () => {
    deleteStatusColumn.mutate({ statusId });
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-transparent-[16] flex w-fit flex-col gap-5 rounded-lg bg-[#00000029] p-5">
      <div className="group relative flex items-center">
        <h2 className="flex justify-center text-lg font-extrabold">
          {statusName}
        </h2>
        {/* Delete Icon for the column */}
        <button
          className="absolute right-2 top-2 stroke-gray-500 hover:stroke-rose-500"
          onClick={() => setIsDeleteModalOpen(true)}
          aria-label="Delete Status Column"
        >
          <TrashIcon />
        </button>
      </div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          projectId={projectId}
          statusId={statusId}
          task={task}
        />
      ))}
      <NewTaskCard
        statusId={statusId}
        projectId={projectId}
        onTaskCreated={handleTaskCreated}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              <p>Are you sure you want to remove this status column?</p>
              <p>This will also remove all tasks within the status</p>
              <p>(This action cannot be undone)</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteColumn}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskStatusColumn;
