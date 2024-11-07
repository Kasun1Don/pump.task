"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export async function updateUserSettings({
  walletId,
  language,
  email,
  dueDate,
  comments,
  assignedToCard,
  removedFromCard,
  changeCardStatus,
  newBadge,
  image,
  bio,
  name,
  emailVerified,
  twoFactorAuth,
}: {
  walletId: string;
  language?: string;
  email?: string;
  dueDate?: boolean;
  comments?: boolean;
  assignedToCard?: boolean;
  removedFromCard?: boolean;
  changeCardStatus?: boolean;
  newBadge?: boolean;
  image?: string;
  bio?: string;
  name?: string;
  emailVerified?: boolean;
  twoFactorAuth?: boolean;
}) {
  try {
    await api.user.update({
      walletId,
      email,
      image,
      bio,
      name,
      emailVerified,
      userSettings: {
        language,
        dueDate,
        comments,
        twoFactorAuth,
        assignedToCard,
        removedFromCard,
        changeCardStatus,
        newBadge,
      },
    });
    revalidatePath("/settings", "page");
    revalidatePath("/profile", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return new Error("An error occurred while updating user settings.");
  }
}
