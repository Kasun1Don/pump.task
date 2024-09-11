import Image from "next/image";

const TaskCard = () => {
  return (
    <div className="max-w-md rounded-lg border border-zinc-900 bg-zinc-950 p-4 text-white shadow-md hover:cursor-pointer hover:border-[#27272a] hover:bg-[#0d0d0f]">
      {/* Tags */}
      <div className="mb-3 flex space-x-2">
        <span className="rounded-full bg-emerald-300 px-2 py-1 text-xs text-black">
          Frontend
        </span>
        <span className="rounded-full bg-indigo-400 px-2 py-1 text-xs text-black">
          Backend
        </span>
      </div>
      {/* Task Title */}
      <h3 className="text-lg font-semibold">Task Title</h3>
      {/* Task Description */}
      <p className="line-clamp-2 text-sm text-zinc-400">
        Brief description of what the task is. Can expand to 2 lines but gets
        truncated if longer.
      </p>
      {/* Assignee and Due Date */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Image
            src="/userProfileIcon.png"
            alt="Assignee Avatar"
            width={12}
            height={12}
          />
          <span className="text-sm">james</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <span>🕒</span>
          <span>12-Aug</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
