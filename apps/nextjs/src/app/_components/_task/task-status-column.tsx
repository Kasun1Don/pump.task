import NewTaskModal from "./new-task-modal";
import TaskCard from "./task-card";

const TaskStatusColumn = () => {
  return (
    <div className="bg-transparent-[16] flex w-fit flex-col gap-5 rounded-lg bg-[#00000029] p-5">
      <h2 className="flex justify-center text-lg font-extrabold">
        In Progress
      </h2>
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <NewTaskModal />
    </div>
  );
};

export default TaskStatusColumn;
