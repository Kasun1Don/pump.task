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

import type { UserClass } from "@acme/db";
import type {
  ObjectIdString,
  StatusColumn,
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
import { Input } from "@acme/ui/input";
import { TaskCardSchema } from "@acme/validators";

import { api } from "~/trpc/react";
import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";
import NewTaskCard from "./new-task-card";
import TaskCard from "./task-card";

interface TaskStatusColumnProps {
  statusColumn: StatusColumn;
  members:
    | {
        role: string;
        userData: UserClass;
        projectId: ObjectIdString;
      }[]
    | undefined;
  selectedMembers: string[];
}

const TaskStatusColumn = ({
  statusColumn,
  members,
  selectedMembers,
}: TaskStatusColumnProps) => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState(statusColumn.name);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isAnyTaskCardModalOpen, setIsAnyTaskCardModalOpen] = useState(false);

  const handleModalStateChange = (isAnyModalOpen: boolean) => {
    setIsAnyTaskCardModalOpen(isAnyModalOpen);
  };

  const cookieWallet = document.cookie
    .split("; ")
    .find((row) => row.startsWith("wallet="))
    ?.split("=")[1];

  const isOwner = () => {
    const currentUser = members?.find(
      (member) => member.userData.walletId === cookieWallet,
    );
    return (
      currentUser &&
      (currentUser.role === "Owner" || currentUser.role === "Admin")
    );
  };

  // Drag and drop sorting
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: statusColumn._id,
      disabled:
        // I need to do this to disable sorting when a dialog is open or when the column is protected but eslint doesn't like it
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        statusColumn.isProtected ||
        isDeleteModalOpen ||
        isOptionsVisible ||
        isRenameModalOpen ||
        isAnyTaskCardModalOpen,
    });
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
    if (statusColumn.isProtected) {
      console.log("Task is protected");
    }
  };

  // Mutation for renaming the status column
  const renameStatusColumn = api.task.renameStatusColumn.useMutation({
    onSuccess: async () => {
      console.log("Status column renamed successfully");
      // invalidate statuses and tasks to refresh data
      await utils.task.getStatusesByProjectId.invalidate();
      await utils.task.getTaskByStatusId.invalidate();
      await utils.status.getStatusesByProjectId.invalidate();
    },
    onError: (error) => console.error("Error renaming status column:", error),
  });

  // Function to handle renaming
  const handleRenameColumn = () => {
    renameStatusColumn.mutate({
      statusId: statusColumn._id,
      newName: newStatusName,
    });
    setIsRenameModalOpen(false);
  };

  const handleCloseRenameDialog = () => {
    setIsRenameModalOpen(false);
    setNewStatusName(statusColumn.name); // Reset input to original name if closed without saving
  };

  // Deletion mutation for the status column
  const deleteStatusColumn = api.task.deleteStatusColumn.useMutation({
    onSuccess: async () => {
      console.log("Status column deleted successfully");
      await utils.task.getTaskByStatusId.invalidate(); // Invalidate tasks and refresh data
      await utils.task.getStatusesByProjectId.invalidate();
      await utils.status.getStatusesByProjectId.invalidate();
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

  // filter tasks based on selected members
  const filteredTasks = tasks.filter((task) => {
    const assigneeId = task.assigneeId;
    if (selectedMembers.length === 0) return true;
    if (!assigneeId) return false;
    return selectedMembers.includes(assigneeId);
  });

  return (
    <div
      className="bg-transparent-[16] group/status-column relative flex min-w-[350px] flex-col gap-5 rounded-lg bg-[#0000004a] p-3 hover:cursor-pointer"
      onMouseLeave={() => setIsOptionsVisible(false)}
      {...attributes}
      ref={setNodeRef}
      {...listeners}
      style={style}
    >
      {/* don't show menu if protected (approved column) */}
      {statusColumn.isProtected === false && (
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
      )}

      {/* Options (delete and rename) */}
      {isOptionsVisible && (
        <div
          className="border-1 absolute right-2 top-4 z-50 flex flex-col gap-4 rounded border-white border-opacity-30 bg-black stroke-gray-500 p-3 text-sm shadow-lg"
          onMouseLeave={() => setIsOptionsVisible(false)}
        >
          {/* Rename option - only show if not protected */}
          {statusColumn.isProtected === false && (
            <button
              className="flex items-center gap-2 text-gray-500 hover:stroke-blue-500 hover:text-blue-500"
              onClick={() => {
                setIsRenameModalOpen(true);
                setIsOptionsVisible(false); // Close the menu after rename
              }}
            >
              <EditIcon /> Rename
            </button>
          )}

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
          items={filteredTasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              onModalStateChange={handleModalStateChange}
              members={members}
              currentUserWalletId={cookieWallet ?? ""}
              key={task._id}
              projectId={statusColumn.projectId}
              statusId={statusColumn._id}
              task={task}
              statusColumnName={statusColumn.name}
            />
          ))}
          {statusColumn.isProtected === false && isOwner() && (
            <NewTaskCard
              members={members}
              statusId={statusColumn._id}
              projectId={statusColumn.projectId}
              onTaskCreated={handleTaskCreated}
            />
          )}

          {/* Rename Dialog */}
          <Dialog
            open={isRenameModalOpen}
            onOpenChange={handleCloseRenameDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Status Column</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <Input
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="Enter new column name"
                  className="mt-2"
                />
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRenameModalOpen(false);
                    handleCloseRenameDialog();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-zesty-green hover:bg-zesty-green hover:bg-opacity-80"
                  onClick={handleRenameColumn}
                  disabled={!newStatusName.trim()}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this status column? This will
                  also remove all tasks within the status (This action cannot be
                  undone)
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
