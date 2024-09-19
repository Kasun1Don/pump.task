import NewTaskCard from "./new-task-card";
import TaskCard from "./task-card";

const TaskStatusColumn = ({ statusTitle }: { statusTitle: string }) => {
  return (
    <div className="bg-transparent-[16] flex w-fit flex-col gap-5 rounded-lg bg-[#00000029] p-5">
      <h2 className="flex justify-center text-lg font-extrabold">
        {statusTitle}
      </h2>
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <NewTaskCard />
    </div>
  );
};

export default TaskStatusColumn;
