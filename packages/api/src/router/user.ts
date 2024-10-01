 
 
 
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { LoginHistory, User } from "@acme/db";

import { publicProcedure } from "../trpc";

export const userRouter = {
  /*
   * @ROUTE -- LOGIN
   *  Login a user with wallet ID and create a new login history
   *
   * @PARAMS:
   *   walletId - The wallet ID of the user  MUST BE UNIQUE
   *   location - The location of the user (General to a City not exact)  (OPTIONAL)
   *   browser - The browser of the user  (OPTIONAL)
   *   operatingSystem - The operating system of the user  (OPTIONAL)
   *
   * @USAGE
   *  Generally used in client components as the users browser and OS are inputs to the function. Can be used in server side code as well but will need to pass the users *  browser and OS as inputs for complete Login Histories. (If left empty, the route won't throw error but will just specific the browser and OS as unknown)
   *
   *
   * @EXAMPLE
   *   const Login = await mutation.mutateAsync({
   *      walletId: wallet,
   *      browser: "Chromium",
   *      operatingSystem: "Windows 10",
   *      location: "Brisbane, Australia",
   *    });
   *
   * @RETURNS
   *  The user Object / Document
   */
  login: publicProcedure
    .input(
      z.object({
        walletId: z.string(),
        location: z.string().optional(),
        browser: z.string().optional(),
        operatingSystem: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Find user by wallet ID
        let user = await User.findOne({ walletId: input.walletId })
          .populate({
            path: "projects",
            model: "ProjectClass",
          })
          .lean();

        // If user does not exist, throw an error
        if (!user) {
          throw new Error("User not found");
        }

        // Create a new login history Instance
        const newLogin = await LoginHistory.create({
          location: input.location ?? "unknown",
          browser: input.browser ?? "unknown",
          operatingSystem: input.operatingSystem ?? "unknown",
        });

        // Update the user's login history Array and add the new login
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $push: { loginHistories: newLogin._id },
          },
          { new: true },
        )
          .populate({
            path: "projects",
            model: "ProjectClass",
          })
          .lean();

        // Convert ObjectIds to strings
        const serializedUser = {
          ...user,
          _id: user?._id.toString(),
          projects: user?.projects?.map((project) => ({
            ...project,
            _id: project._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error during user login process:", error);
        throw new Error("Failed to log in user");
      }
    }),

  /*
   * @ROUTE -- CREATE
   *  Create a new user with wallet ID and create a new login history
   *
   * @PARAMS:
   *   walletId - The wallet ID of the user MUST BE UNIQUE
   *   name - The name of the user (Can be Duplicate)
   *   email - The email of the user MUST BE UNIQUE
   *   image - The image of the user / Profile Icon
   *   location - The location of the user (OPTIONAL)
   *   browser - The browser of the user (OPTIONAL)
   *   operatingSystem - The operating system of the user (OPTIONAL)
   *
   * @USAGE
   *  Used in client a component as the users browser and OS are inputs to the function, This is the route that a user will post to when they login and they don't have a *  name or are login in for the first time. (If LoginHistoy Inputs left empty, the route won't throw error but will just specific the browser and OS as unknown)
   *
   *
   * @EXAMPLE
   *   const Login = await mutation.mutateAsync({
   *      walletId: wallet,
   *      name: "Labrys Inc",
   *      email: "Crypto@Labrys.com.au"
   *      image: "/profileImage1.png",
   *      browser: "Chromium",
   *      operatingSystem: "Windows 10",
   *      location: "Brisbane, Australia",
   *    });
   *
   * @RETURNS
   *  The user Object / Document
   */
  create: publicProcedure
    .input(
      z.object({
        walletId: z.string(),
        name: z.string(),
        email: z.string().email(),
        image: z.string(),
        location: z.string().optional(),
        browser: z.string().optional(),
        operatingSystem: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const newLogin = await LoginHistory.create({
          location: input.location ?? "unknown",
          browser: input.browser ?? "unknown",
          operatingSystem: input.operatingSystem ?? "unknown",
        });

        const newUser = await User.create({
          walletId: input.walletId,
          name: input.name,
          email: input.email,
          image: input.image,
          userSettings: {},
          loginHistories: [newLogin._id],
        });

        // Convert ObjectIds to strings
        const serializedUser = {
          ...newUser,
          _id: newUser._id.toString(),
          projects: newUser.projects?.map((project) => ({
            ...project,
            _id: project._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    }),

  /*
   * @ROUTE -- BY WALLET
   *  Get the user data by wallet ID
   *
   * @PARAMS
   *   walletId - The wallet ID of the user
   *
   * @USAGE
   *  Used in client and server components to fetch a user by their wallet ID. This is the route that a user fetch when they login or require their user data.
   *
   *
   * @EXAMPLE
   *   const Login = await api.user.byWallet.useQuery({
   *      walletId: wallet,
   *    });
   *
   * @RETURNS
   *  The user Object / Document
   */
  byWallet: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await User.findOne({ walletId: input.walletId })
          .populate({
            path: "projects",
            model: "ProjectClass",
          })
          .lean();

        if (!user) {
          throw new Error("User not found");
        }

        // Convert ObjectIds to strings and return
        const serializedUser = {
          ...user,
          _id: user._id.toString(),
          projects: user.projects?.map((project) => ({
            ...project,
            _id: project._id.toString(),
          })),
          loginHistories: user.loginHistories?.map((history) => ({
            _id: history._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error fetching user by wallet:", error);
        throw new Error("Failed to fetch user");
      }
    }),

  /*
   * @ROUTE -- UPDATE
   * Update the user details by wallet ID
   *
   * @PARAMS:
   *   walletId - The wallet ID of the user
   *   ALL OTHER INPUTS ARE OPTIONAL
   *
   * @USAGE
   *  Used in client and server components to update a user by their wallet ID.
   * This is the route that a user fetch when they need to update their user data.
   *
   * @EXAMPLE
   *   const updatedUser = await mutation.mutateAsync({
   *      walletId: wallet,
   *      name: "Labrys Inc",
   *      email: "Crypto@Labrys.com.au",
   *      image: "/profileImage1.png",
   *      userSettings: {
   *          language: "Spanish",
   *          isThemeDark: true,
   *          twoFactorAuth: true,
   *          notificationEmail: "Crypto@labrys.com.au",
   *          dueDate: false,
   *          comments: true,
   *          assignedToCard: false,
   *          removedFromCard: false,
   *          changeCardStatus: true,
   *          newBadge: true,
   *      },
   *   });
   *
   * @RETURNS
   * The updated user Object / Document
   */
  update: publicProcedure
    .input(
      z.object({
        walletId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
        userSettings: z
          .object({
            language: z.string().optional(),
            isThemeDark: z.boolean().optional(),
            twoFactorAuth: z.boolean().optional(),
            dueDate: z.boolean().optional(),
            comments: z.boolean().optional(),
            assignedToCard: z.boolean().optional(),
            removedFromCard: z.boolean().optional(),
            changeCardStatus: z.boolean().optional(),
            newBadge: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOne({ walletId: input.walletId }).lean();

        if (!user) {
          throw new Error("User not found");
        }

        const updatedData = {
          name: input.name ?? user.name,
          email: input.email ?? user.email,
          image: input.image ?? user.image,
          userSettings: {
            language:
              input.userSettings?.language ?? user.userSettings?.language,
            isThemeDark:
              input.userSettings?.isThemeDark ?? user.userSettings?.isThemeDark,
            twoFactorAuth:
              input.userSettings?.twoFactorAuth ??
              user.userSettings?.twoFactorAuth,
            dueDate: input.userSettings?.dueDate ?? user.userSettings?.dueDate,
            comments:
              input.userSettings?.comments ?? user.userSettings?.comments,
            assignedToCard:
              input.userSettings?.assignedToCard ??
              user.userSettings?.assignedToCard,
            removedFromCard:
              input.userSettings?.removedFromCard ??
              user.userSettings?.removedFromCard,
            changeCardStatus:
              input.userSettings?.changeCardStatus ??
              user.userSettings?.changeCardStatus,
            newBadge:
              input.userSettings?.newBadge ?? user.userSettings?.newBadge,
          },
        };

        // Update the user with the merged data
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          updatedData,
          { new: true },
        );

        if (!updatedUser) {
          throw new Error("Failed to update user details");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating user details:", error);
        throw new Error("Failed to update user details");
      }
    }),

  /*
   * @ROUTE -- DELETE USER
   * Delete the user by wallet ID
   *
   * @PARAMS:
   *   walletId - The wallet ID of the user to be deleted
   *
   * @USAGE
   *  Used in client or server components when a user needs to delete their account.
   *
   * @EXAMPLE
   *   const response = await mutation.mutateAsync({
   *      walletId: wallet,
   *   });
   *
   * @RETURNS
   *  A success message or an error message if the user was not found
   */
  delete: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOneAndDelete({ walletId: input.walletId });

        if (!user) {
          throw new Error("User not found");
        }

        return { message: "User deleted successfully" };
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    }),
} satisfies TRPCRouterRecord;
