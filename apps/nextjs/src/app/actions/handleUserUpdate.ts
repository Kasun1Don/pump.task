"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export async function updateUserSettings({
  walletId,
  language,
  email,
  isThemeDark,
  dueDate,
  comments,
  assignedToCard,
  removedFromCard,
  changeCardStatus,
  newBadge,
  image,
  bio,
}: {
  walletId: string;
  language?: string;
  email?: string;
  isThemeDark?: boolean;
  dueDate?: boolean;
  comments?: boolean;
  assignedToCard?: boolean;
  removedFromCard?: boolean;
  changeCardStatus?: boolean;
  newBadge?: boolean;
  image?: string;
  bio?: string;
}) {
  await api.user.update({
    walletId,
    email,
    image,
    bio,
    userSettings: {
      isThemeDark,
      language,
      dueDate,
      comments,
      assignedToCard,
      removedFromCard,
      changeCardStatus,
      newBadge,
    },
  });

  revalidatePath("/user-settings", "page");
  revalidatePath("/proilfe", "page");
}