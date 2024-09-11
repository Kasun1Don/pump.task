import NewTaskModal from "~/app/_components/_task/new-task-modal";
import TaskCard from "~/app/_components/_task/task-card";

export default function TasksPage() {
  return (
    <div>
      <h1 className="flex justify-center">Tasks Page</h1>
      <div className="bg-transparent-[16] flex w-fit flex-col gap-5 rounded-lg bg-[#00000029] p-5">
        <h2 className="flex justify-center text-lg font-extrabold">
          In Progress
        </h2>
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <NewTaskModal />
      </div>
    </div>
  );
}
