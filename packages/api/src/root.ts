import { authRouter } from "./router/auth";
import { loginHistoryRouter } from "./router/loginHistory";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  loginHistory: loginHistoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
