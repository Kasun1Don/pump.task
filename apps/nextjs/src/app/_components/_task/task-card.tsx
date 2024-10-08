"use client";

import type { z } from "zod";
import Image from "next/image";

import type { ObjectIdString, TaskCardSchema } from "@acme/validators";

import TaskCardDialog from "./task-card-dialog";

type TaskCardData = z.infer<typeof TaskCardSchema>;

interface TaskCardProps {
  task: TaskCardData;
  projectId: ObjectIdString;
  statusId: ObjectIdString;
}

const TaskCard = ({ task, projectId, statusId }: TaskCardProps) => {
  return (
    <TaskCardDialog
      initialValues={task}
      projectId={projectId}
      statusId={statusId}
      onSubmit={(taskData) => console.log(taskData)}
      dialogTrigger={
        <div className="max-w-md rounded-lg border border-zinc-900 bg-zinc-950 p-4 text-white drop-shadow-md hover:cursor-pointer hover:border-[#27272a] hover:bg-[#0d0d0f]">
          <div className="mb-3 flex space-x-2">
            {task.tags.defaultTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-300 px-2 py-1 text-xs text-black"
              >
                {tag}
              </span>
            ))}
            {task.tags.userGeneratedTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-400 px-2 py-1 text-xs text-black"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="line-clamp-2 text-sm text-zinc-400">
            {task.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Image
                src="/userProfileIcon.png"
                alt="Assignee Avatar"
                width={12}
                height={12}
              />
              <span className="text-sm">{task.assigneeId}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>🕒</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default TaskCard;
