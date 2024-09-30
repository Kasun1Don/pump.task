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

import { updateUserSettings } from "~/app/actions/handleUserSettingsUpdate";

// Schema for the form fields
const emailFormSchema = z.object({
  changeEmail: z.string().email({ message: "Invalid email address" }),
  dueDates: z.boolean().optional(),
  comments: z.boolean().optional(),
  assignToCard: z.boolean().optional(),
  removedFromCard: z.boolean().optional(),
  changeCardStatus: z.boolean().optional(),
  newBadge: z.boolean().optional(),
});

export default function EmailNotifications({
  email,
  dueDate,
  comments,
  assignToCard,
  removeFromCard,
  changeCardStatus,
  newBadge,
  walletId,
}: {
  email: string | undefined;
  dueDate: boolean | undefined;
  comments: boolean | undefined;
  assignToCard: boolean | undefined;
  removeFromCard: boolean | undefined;
  changeCardStatus: boolean | undefined;
  newBadge: boolean | undefined;
  walletId: string;
}): JSX.Element {
  const [isEditMode, setIsEditMode] = useState(false);

  const emailNotificationForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      changeEmail: email,
      dueDates: dueDate,
      comments: comments,
      assignToCard: assignToCard,
      removedFromCard: removeFromCard,
      changeCardStatus: changeCardStatus,
      newBadge: newBadge,
    },
  });

  // Handle user settings update
  const handleUserSettingsUpdate = async () => {
    const email = emailNotificationForm.getValues("changeEmail");
    const dueDates = emailNotificationForm.getValues("dueDates");
    const comments = emailNotificationForm.getValues("comments");
    const assignedToCard = emailNotificationForm.getValues("assignToCard");
    const removedFromCard = emailNotificationForm.getValues("removedFromCard");
    const changeCardStatus =
      emailNotificationForm.getValues("changeCardStatus");
    const newBadge = emailNotificationForm.getValues("newBadge");

    const settingsToUpdate = {
      walletId,
      email: email,
      dueDate: dueDates,
      comments: comments,
      assignedToCard: assignedToCard,
      removedFromCard: removedFromCard,
      changeCardStatus: changeCardStatus,
      newBadge: newBadge,
    };

    await updateUserSettings(settingsToUpdate);

    setIsEditMode(false);
  };

  return (
    <Form {...emailNotificationForm}>
      <form className="max-w-4/6 w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg border bg-zinc-950 p-3 shadow-sm">
        <h1>Notifications</h1>

        {/* Change Notification Email */}
        <FormField
          control={emailNotificationForm.control}
          name="changeEmail"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="max-w-60 space-y-0.5">
                <FormLabel>Email</FormLabel>
                <FormDescription>
                  Change your email for notifications & 2FA Authentication.
                </FormDescription>
              </div>
              <div className="flex w-fit flex-row items-center justify-center gap-8 px-6 py-4">
                <FormControl>
                  {isEditMode ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="mx-4 w-auto min-w-[200px] rounded-lg border bg-zinc-950 px-6 py-4 text-xs shadow-sm"
                        placeholder="Enter new email"
                      />
                      {fieldState.error && (
                        <span className="text-xs text-red-500">
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs">{field.value}</span>
                  )}
                </FormControl>
                <button
                  type="button"
                  className="text-zesty-green w-7 text-sm"
                  onClick={() => {
                    if (isEditMode) {
                      void emailNotificationForm.handleSubmit(async () => {
                        await handleUserSettingsUpdate();
                        setIsEditMode(false);
                      })();
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    void handleUserSettingsUpdate();
                  }}
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    void handleUserSettingsUpdate();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Assigned to a Card */}
        <FormField
          control={emailNotificationForm.control}
          name="assignToCard"
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    void handleUserSettingsUpdate();
                  }}
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    void handleUserSettingsUpdate();
                  }}
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    void handleUserSettingsUpdate();
                  }}
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    void handleUserSettingsUpdate();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
