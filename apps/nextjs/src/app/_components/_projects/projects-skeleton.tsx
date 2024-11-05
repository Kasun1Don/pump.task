import { Skeleton } from "@acme/ui/skeleton";

const ProjectsSkeleton = () => {
  // 3 x 3 skeleton cards to resemble the project cards
  return (
    <div className="mx-auto grid max-w-7xl auto-rows-min grid-cols-3 gap-4 pt-8">
      {/* create an array with 9 empty slots and maps a skeleton card for each slot*/}
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton
          // need a unique key prop for each child in list
          key={i}
          className="group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-lg border"
        />
      ))}
    </div>
  );
};

export default ProjectsSkeleton;
