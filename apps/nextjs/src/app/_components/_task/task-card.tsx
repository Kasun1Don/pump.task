"use client";

import type { z } from "zod";
import Image from "next/image";

import type { taskCardSchema } from "./task-card-schema";
import TaskCardDialog from "./task-card-dialog";

type TaskCardData = z.infer<typeof taskCardSchema>;

const TaskCard = () => {
  const taskCardData: TaskCardData = {
    title: "Task Title",
    description:
      "Brief description of what the task is. Can expand to 2 lines but gets truncated if longer.",
    dueDate: new Date().toISOString(),
    status: "In QA",
    assignee: "james",
    tags: {
      defaultTags: ["Frontend", "Backend"],
      userGeneratedTags: [],
    },
    customFields: [],
  };

  return (
    <TaskCardDialog
      initialValues={taskCardData}
      onSubmit={(data) => console.log(data)}
      dialogTrigger={
        <div className="max-w-md rounded-lg border border-zinc-900 bg-zinc-950 p-4 text-white drop-shadow-md hover:cursor-pointer hover:border-[#27272a] hover:bg-[#0d0d0f]">
          <div className="mb-3 flex space-x-2">
            <span className="rounded-full bg-emerald-300 px-2 py-1 text-xs text-black">
              Frontend
            </span>
            <span className="rounded-full bg-indigo-400 px-2 py-1 text-xs text-black">
              Backend
            </span>
          </div>
          <h3 className="text-lg font-semibold">{taskCardData.title}</h3>
          <p className="line-clamp-2 text-sm text-zinc-400">
            {taskCardData.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Image
                src="/userProfileIcon.png"
                alt="Assignee Avatar"
                width={12}
                height={12}
              />
              <span className="text-sm">{taskCardData.assignee}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>🕒</span>
              <span>12-Aug</span>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default TaskCard;
