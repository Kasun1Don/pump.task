import { Skeleton } from "@acme/ui/skeleton";

const TaskBoardSkeleton = () => {
  // Predefined static heights for skeleton tasks
  const heights = ["h-20", "h-24", "h-28", "h-32"];

  return (
    <div>
      {/* Skeleton for project title */}
      <Skeleton className="mx-auto mb-6 h-10 w-1/2" />

      <div className="flex flex-row gap-3 p-6">
        {/* Column 1: 3 tasks */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {heights.slice(0, 3).map((height, idx) => (
            <Skeleton key={idx} className={`${height} mb-4 w-full`} />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>

        {/* Column 2: 2 tasks */}
        <div className="flex w-full flex-col">
          <Skeleton className="mb-4 h-8 w-full" />
          {heights.slice(0, 2).map((height, idx) => (
            <Skeleton key={idx} className={`${height} mb-4 w-full`} />
          ))}
          <Skeleton className="mx-auto h-8 w-2/3" />
        </div>

        {/* Other columns can be adjusted similarly */}
      </div>
    </div>
  );
};

export default TaskBoardSkeleton;
