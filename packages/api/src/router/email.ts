import type { TRPCRouterRecord } from "@trpc/server";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

import { User } from "@acme/db";

import { publicProcedure } from "../trpc";

// Set your SendGrid API key

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export const emailRouter = {
  sendEmail: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      // Query the User
      const user = await User.findOne({ walletId: input.walletId });

      if (!user) {
        throw new Error("User not found");
      }

      // Create a unique 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000);
      console.log("Code:", code);

      // Store the code in the 2FA collection
      // const result = await TwoFactorAuth.create({
      //   walletId: input.walletId,
      //   code,
      // });

      // if (!result) {
      //   throw new Error("Failed to store code");
      // }

      // create msg object
      const msg = {
        to: "bendavies600@gmail.com",
        from: "coderacademylabrys@gmail.com",
        subject: "Sending with SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      };

      try {
        // Send email using SendGrid

        await sgMail.send(msg);
        console.log("Email sent");
        return { success: true, message: "Email sent successfully" };
      } catch (error) {
        console.error("Error sending email", error);
        throw new Error("Failed to send email");
      }
    }),
  // checkCode: publicProcedure.query(async ({ code }) => {
  //   // Check the code against the 2FA collection
  //   // If the code is correct, return true, otherwise return false
  //   return { success: true, message: "Code is correct" };
  // }
} satisfies TRPCRouterRecord;
