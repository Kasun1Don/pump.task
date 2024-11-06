import type { TRPCRouterRecord } from "@trpc/server";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

import { TwoFactorAuth, User } from "@acme/db";

import { protectedProcedure, publicProcedure } from "../trpc";

// Set your SendGrid API key

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export const emailRouter = {
  sendEmail: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await User.findOne({ walletId: input.walletId });
        if (!user?.email) {
          return { success: false, message: "User not found" };
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await TwoFactorAuth.findOneAndUpdate(
          { walletId: input.walletId },
          { $set: { code: code } },
          { new: true, upsert: true },
        );

        const msg = {
          to: user.email,
          from: "coderacademylabrys@gmail.com",
          subject: "Pump.Task 2FA Authentication",
          html: `<h2>Pump.Task</h2><br><br><strong>Your code is ${code}</strong>`,
        };

        await sgMail.send(msg);
        return { success: true, message: "Email sent successfully" };
      } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email" };
      }
    }),
  sendInvite: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const msg = {
          to: input.email,
          from: "coderacademylabrys@gmail.com",
          subject: "Pump.Task Invite",
          html: "http://localhost:3000/",
        };

        await sgMail.send(msg);
        return {
          success: true,
          message: "Email sent successfully",
          email: input.email,
        };
      } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email" };
      }
    }),
  verifyCode: protectedProcedure
    .input(z.object({ walletId: z.string(), code: z.string() }))
    .query(async ({ input }) => {
      try {
        const verifyCode = await TwoFactorAuth.findOne({
          walletId: input.walletId,
        });
        if (!verifyCode) {
          return { success: false, message: "Document not found" };
        }

        if (verifyCode.code !== input.code) {
          return { success: false, message: "Invalid code. Please try again." };
        }

        const updateUser = await User.findOneAndUpdate(
          { walletId: input.walletId },
          {
            $set: {
              emailVerified: true,
              "userSettings.twoFactorAuth": true,
            },
          },
          { new: true },
        );

        if (!updateUser) {
          throw new Error("Failed to update user details");
        }

        return { success: true, message: "Code Verified" };
      } catch (error) {
        console.error("Error verifying 2FA code:", error);
        return {
          success: false,
          message: "An error occurred during verification",
        };
      }
    }),
  requestAccess: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        requesterEmail: z.string(),
        requesterName: z.string(),
        ownerEmail: z.string(),
        projectName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const msg = {
          to: input.ownerEmail,
          from: "coderacademylabrys@gmail.com",
          subject: `Access Request for ${input.projectName}`,
          html: `
            <h2>Project Access Request</h2>
            <p>${input.requesterName} (${input.requesterEmail}) has requested access to your project: ${input.projectName}</p>
            <p>Project URL: <a href="http://localhost:3000/tasks/${input.projectId}">View Project</a></p>
            <p>You can manage project members from the project settings page.</p>
          `,
        };

        await sgMail.send(msg);
        return { success: true, message: "Access request sent successfully" };
      } catch (error) {
        console.error("Error sending access request:", error);
        return { success: false, message: "Failed to send access request" };
      }
    }),
} satisfies TRPCRouterRecord;
