import type { DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { StatusColumn, TaskCard as TaskCardData } from "@acme/validators";
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
import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";
import NewTaskCard from "./new-task-card";
import TaskCard from "./task-card";

// type TaskCardData = z.infer<typeof TaskCardSchema>;

interface TaskStatusColumnProps {
  statusColumn: StatusColumn;
}

const TaskStatusColumn = ({ statusColumn }: TaskStatusColumnProps) => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false); // State to control options visibility

  // Drag and drop sorting
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: statusColumn._id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Retrieve tasks
  const { data: taskData } = api.task.getTaskByStatusId.useQuery(
    {
      statusId: statusColumn._id,
    },
    {
      enabled: Boolean(statusColumn._id), // Only run query if projectId is valid
    },
  );

  useEffect(() => {
    if (taskData) {
      const validationResult = TaskCardSchema.array().safeParse(taskData);

      if (validationResult.success) {
        setTasks(validationResult.data);
      } else {
        console.error("Validation error:", validationResult.error.errors);
      }
    }
    // Add parentTaskState as a dependency to re-fetch tasks on its update
  }, [taskData]);

  const utils = api.useUtils();

  // Function to handle new task's created
  const handleTaskCreated = (newTask: TaskCardData) => {
    if (newTask.statusId === statusColumn._id) {
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
    deleteStatusColumn.mutate({ statusId: statusColumn._id });
    setIsDeleteModalOpen(false);
  };

  // Drag and drop event handler swap tasks in the array
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((task) => task._id === active.id);
      const overIndex = tasks.findIndex((task) => task._id === over.id);

      return arrayMove(tasks, activeIndex, overIndex);
    });
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  return (
    <div
      className="bg-transparent-[16] group/status-column relative flex min-w-[350px] flex-col gap-5 rounded-lg bg-[#0000004a] p-3 hover:cursor-pointer"
      onMouseLeave={() => setIsOptionsVisible(false)}
      {...attributes}
      ref={setNodeRef}
      {...listeners}
      style={style}
    >
      {/* Menu in the top right corner */}
      <div
        onClick={() => setIsOptionsVisible((prev) => !prev)}
        className="group/menu-button absolute right-2 top-2 z-50 flex cursor-pointer items-center space-x-2 opacity-0 transition-opacity duration-300 group-hover/status-column:opacity-100"
      >
        <div aria-label="Options" className="flex gap-0.5 p-1">
          <div className="h-1 w-1 rounded-full bg-gray-500 transition-all group-hover/menu-button:bg-white"></div>
          <div className="h-1 w-1 rounded-full bg-gray-500 transition-all group-hover/menu-button:bg-white"></div>
          <div className="h-1 w-1 rounded-full bg-gray-500 transition-all group-hover/menu-button:bg-white"></div>
        </div>
      </div>

      {/* Options (delete and rename) */}
      {isOptionsVisible && (
        <div
          className="border-1 absolute right-2 top-4 z-50 flex flex-col gap-4 rounded border-white border-opacity-30 bg-black stroke-gray-500 p-2 shadow-lg"
          onMouseLeave={() => setIsOptionsVisible(false)}
        >
          {/* Rename option */}
          <button
            className="flex items-center gap-2 text-gray-500 hover:stroke-blue-500 hover:text-blue-500"
            onClick={() => {
              console.log("Rename column");
              setIsOptionsVisible(false); // Close the menu after rename
            }}
          >
            <EditIcon /> Rename
          </button>

          {/* Delete option */}
          {statusColumn.isProtected === false && (
            <button
              className="flex items-center gap-2 text-gray-500 hover:stroke-red-500 hover:text-red-500"
              onClick={() => {
                setIsDeleteModalOpen(true);
                setIsOptionsVisible(false); // Close the menu after clicking delete
              }}
            >
              <TrashIcon /> Delete
            </button>
          )}
        </div>
      )}
      {/* Status name centered below the menu */}
      <h2 className="flex justify-between text-lg font-extrabold">
        {statusColumn.name}
      </h2>

      <DndContext
        onDragEnd={onDragEnd}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              projectId={statusColumn.projectId}
              statusId={statusColumn._id}
              task={task}
            />
          ))}

          {statusColumn.isProtected === false && (
            <NewTaskCard
              statusId={statusColumn._id}
              projectId={statusColumn.projectId}
              onTaskCreated={handleTaskCreated}
            />
          )}
          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  <div>Are you sure you want to remove this status column?</div>
                  <div>This will also remove all tasks within the status</div>
                  <div>(This action cannot be undone)</div>
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
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskStatusColumn;
