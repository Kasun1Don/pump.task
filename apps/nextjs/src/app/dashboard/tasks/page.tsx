import TaskStatusColumn from "~/app/_components/_task/task-status-column";

export default function TasksPage() {
  return (
    <div>
      <h1 className="flex justify-center">Tasks Page</h1>
      <div className="flex flex-row gap-3 p-6">
        <TaskStatusColumn statusTitle="To Do" />
        <TaskStatusColumn statusTitle="In Progress" />
        <TaskStatusColumn statusTitle="Done" />
      </div>
    </div>
  );
}
