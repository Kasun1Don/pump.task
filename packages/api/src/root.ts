import { authRouter } from "./router/auth";
import { badgeRouter } from "./router/badge";
import { emailRouter } from "./router/email";
import { loginHistoryRouter } from "./router/loginHistory";
import { memberRouter } from "./router/member";
import { projectRouter } from "./router/project";
import { taskRouter } from "./router/task";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  loginHistory: loginHistoryRouter,
  project: projectRouter,
  task: taskRouter,
  email: emailRouter,
  badge: badgeRouter,
  member: memberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
