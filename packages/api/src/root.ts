import { authRouter } from "./router/auth";
import { taskRouter } from "./router/task";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
