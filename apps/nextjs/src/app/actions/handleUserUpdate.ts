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
  name,
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
  name?: string;
}) {
  await api.user.update({
    walletId,
    email,
    image,
    bio,
    name,
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
  revalidatePath("/profile", "page");
}
