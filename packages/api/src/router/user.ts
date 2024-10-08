import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import type { BadgeClass } from "@acme/db";
import { LoginHistory, User } from "@acme/db";

import { Skill } from "../../../db/src/schema/Badges";
import { protectedProcedure } from "../trpc";

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
  login: protectedProcedure
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
  create: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        name: z.string(),
        email: z.string().email(),
        image: z.string().optional(),
        location: z.string().optional(),
        browser: z.string().optional(),
        operatingSystem: z.string().optional(),
        bio: z.string().optional(),
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
          bio: input.image,
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
  byWallet: protectedProcedure
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
  update: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
        bio: z.string().optional(),
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
          bio: input.bio ?? user.bio,
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
  overview: protectedProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      const user = await User.findOne({ walletId: input.walletId })
        .populate("projects")
        .populate("badges")
        .lean();

      if (!user) {
        throw new Error("User not found");
      }

      const serializedUser = {
        ...user,
        _id: user._id.toString(),
        projects: user.projects?.map((project) => ({
          ...project,
          _id: project._id.toString(),
        })),
        badges: user.badges?.map((badge) => ({
          ...badge,
          _id: badge._id.toString(),
        })),
      };

      const activeProjects = serializedUser.projects?.length ?? 0;
      const totalBadges = serializedUser.badges?.length ?? 0;

      const isBadgeClass = (badge: unknown): badge is BadgeClass => {
        if (typeof badge !== "object" || badge === null) {
          return false;
        }

        const badgeObj = badge as Record<string, unknown>;

        return (
          "receivedDate" in badgeObj &&
          "skill" in badgeObj &&
          (badgeObj.receivedDate instanceof Date ||
            !isNaN(Date.parse(badgeObj.receivedDate as string)))
        );
      };

      const badgesInLast30Days =
        serializedUser.badges?.filter(
          (badge) =>
            isBadgeClass(badge) &&
            new Date(badge.receivedDate) >=
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        ).length ?? 0;

      const daysSinceLastBadge =
        serializedUser.badges &&
        serializedUser.badges.length > 0 &&
        isBadgeClass(serializedUser.badges[0])
          ? Math.floor(
              (Date.now() -
                new Date(serializedUser.badges[0].receivedDate).getTime()) /
                (1000 * 3600 * 24),
            )
          : 0;

      const badgeCounts: { [key in Skill]: number } = {
        [Skill.Backend]: 0,
        [Skill.Frontend]: 0,
        [Skill.Design]: 0,
        [Skill.SmartContracts]: 0,
        [Skill.Integration]: 0,
      };

      serializedUser.badges?.forEach((badge) => {
        if (isBadgeClass(badge)) {
          badgeCounts[badge.skill]++;
        }
      });

      let topSkill = "N/A"; // Default if no badges found
      let maxCount = 0;
      Object.keys(badgeCounts).forEach((skill) => {
        if (badgeCounts[skill as Skill] > maxCount) {
          maxCount = badgeCounts[skill as Skill];
          topSkill = skill;
        }
      });
      return {
        activeProjects,
        totalBadges,
        badgesInLast30Days,
        daysSinceLastBadge,
        topSkill,
      };
    }),
} satisfies TRPCRouterRecord;
