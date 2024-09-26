"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Switch } from "@acme/ui/switch";

import { api } from "~/trpc/react";

// Schema for the form fields
const emailFormSchema = z.object({
  changeEmail: z.string().optional(),
  dueDates: z.boolean().default(false).optional(),
  comments: z.boolean().default(false).optional(),
  assignedToCard: z.boolean().default(false).optional(),
  removedFromCard: z.boolean().default(false).optional(),
  changeCardStatus: z.boolean().default(false).optional(),
  newBadge: z.boolean().default(false).optional(),
});

export default function EmailNotifications({
  walletId,
}: {
  walletId: string;
}): JSX.Element {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    data: userData,
    isLoading,
    isError,
  } = api.user.byWallet.useQuery({ walletId });

  const emailNotificationForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      changeEmail: userData?.email,
      dueDates: userData?.userSettings?.dueDate ?? false,
      comments: userData?.userSettings?.comments ?? false,
      assignedToCard: userData?.userSettings?.assignedToCard ?? false,
      removedFromCard: userData?.userSettings?.removedFromCard ?? false,
      changeCardStatus: userData?.userSettings?.changeCardStatus ?? false,
      newBadge: userData?.userSettings?.newBadge ?? false,
    },
  });

  const ctx = api.useUtils();

  // Update user settings mutation with onSuccess handler to update cache
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: (newData) => {
      ctx.user.byWallet.setData({ walletId }, (prevData) => ({
        ...prevData,
        ...newData,
        loginHistories: prevData?.loginHistories?.map((history) => ({
          ...history,
          _id: history._id.toString(),
        })),
      }));
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  // Handle user settings update
  const handleUserSettingsUpdate = () => {
    const formValues = emailNotificationForm.getValues();

    updateUserMutation.mutate({
      walletId,
      email: formValues.changeEmail,
      userSettings: {
        dueDate: formValues.dueDates,
        comments: formValues.comments,
        assignedToCard: formValues.assignedToCard,
        removedFromCard: formValues.removedFromCard,
        changeCardStatus: formValues.changeCardStatus,
        newBadge: formValues.newBadge,
      },
    });
  };

  if (isLoading) {
    console.log("Loading user data...");
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching user data.");
    return <div>Error loading user data</div>;
  }

  return (
    <Form {...emailNotificationForm}>
      <form className="max-w-4/6 w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg border bg-zinc-950 p-3 shadow-sm">
        <h1>Notifications</h1>

        {/* Change Notification Email */}
        <FormField
          control={emailNotificationForm.control}
          name="changeEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Change Notification Email</FormLabel>
                <FormDescription>
                  Change the email address where you receive notifications.
                </FormDescription>
              </div>
              <div className="mr-2 flex flex-row items-center justify-center gap-2">
                <FormControl>
                  {isEditMode ? (
                    <Input
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      className="size-4 w-fit rounded-lg border bg-zinc-950 p-3 shadow-sm"
                      placeholder="Enter new email"
                    />
                  ) : (
                    <span className="text-xs">
                      {field.value ?? "Enter Email"}
                    </span>
                  )}
                </FormControl>
                <button
                  type="button"
                  className="text-zesty-green ml-4 w-7 text-sm"
                  onClick={() => {
                    if (isEditMode) {
                      handleUserSettingsUpdate();
                    } else {
                      setIsEditMode(true);
                    }
                  }}
                >
                  {isEditMode ? "Save" : "Edit"}
                </button>
              </div>
            </FormItem>
          )}
        />

        <h5>Preferences</h5>

        {/* Due Dates */}
        <FormField
          control={emailNotificationForm.control}
          name="dueDates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Due Dates</FormLabel>
                <FormDescription>
                  Receive notifications for upcoming due dates.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Comments */}
        <FormField
          control={emailNotificationForm.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Comments</FormLabel>
                <FormDescription>
                  When someone comments on a card you're assigned to.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Assigned to a Card */}
        <FormField
          control={emailNotificationForm.control}
          name="assignedToCard"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Assigned to a Card</FormLabel>
                <FormDescription>
                  Get notifications when you're assigned to a card.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Removed from a Card */}
        <FormField
          control={emailNotificationForm.control}
          name="removedFromCard"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Removed from a Card</FormLabel>
                <FormDescription>
                  Get notified when you're removed from a card.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Change in Card Status */}
        <FormField
          control={emailNotificationForm.control}
          name="changeCardStatus"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Change in Card Status</FormLabel>
                <FormDescription>
                  Receive notifications when card status changes.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* New Badge */}
        <FormField
          control={emailNotificationForm.control}
          name="newBadge"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>New Badge</FormLabel>
                <FormDescription>
                  Receive notifications when you earn a new badge.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
