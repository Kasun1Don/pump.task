import { authRouter } from "./router/auth";
import { projectRouter } from "./router/project";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
