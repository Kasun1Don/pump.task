import { Skeleton } from "@acme/ui/skeleton";

const ProjectsSkeleton = () => {
  // 3 x 3 skeleton cards to resemble the project cards
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
      {/* create an array with 9 empty slots and maps a skeleton card for each slot*/}
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton
          // need a unique key prop for each child in list
          key={i}
          // TODO: fix this so that the 7th card onward is hidden for lg
          className={`group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-lg border ${
            i >= 3 ? "hidden sm:block" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default ProjectsSkeleton;
