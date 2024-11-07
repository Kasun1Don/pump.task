import { Skeleton } from "@acme/ui/skeleton";

// Helper function to generate random heights for skeleton tasks
const getRandomHeight = () => {
  const heights = ["h-20", "h-24", "h-28", "h-32"]; // Range of different heights
  return heights[Math.floor(Math.random() * heights.length)];
};

const TaskBoardSkeleton = () => {
  return (
    <div>
      {/* Skeleton for project title */}
      <Skeleton className="mx-auto mb-6 h-10 w-1/2" />

      <div className="flex flex-row gap-3 p-6">
        {/* Column 1: 3 tasks */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className={`${getRandomHeight()} mb-4 w-full`}
            />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>

        {/* Column 2: 2 tasks */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className={`${getRandomHeight()} mb-4 w-full`}
            />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>

        {/* Column 3: 3 tasks */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className={`${getRandomHeight()} mb-4 w-full`}
            />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>

        {/* Column 4: 1 task */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {Array.from({ length: 1 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className={`${getRandomHeight()} mb-4 w-full`}
            />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>

        {/* Column 5: 3 tasks */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className={`${getRandomHeight()} mb-4 w-full`}
            />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default TaskBoardSkeleton;
