"use client";

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
  FormMessage,
} from "@acme/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Switch } from "@acme/ui/switch";

import { api } from "~/trpc/react";

// Language form zod schema
const languageFormSchema = z.object({
  language: z
    .string({ required_error: "Please select a language." })
    .default("English"),
});

// Theme form zod schema
const themeFormSchema = z.object({
  theme: z.boolean().default(true).optional(),
});

export default function AccountSettings({
  walletId,
}: {
  walletId: string;
}): JSX.Element {
  const {
    data: userData,
    isLoading,
    isError,
  } = api.user.byWallet.useQuery({ walletId });

  if (isLoading) {
    console.log("Loading user data...");
  }

  if (isError) {
    console.error("Error fetching user data.");
  }

  // Language form setup
  const languageForm = useForm<z.infer<typeof languageFormSchema>>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: { language: userData?.userSettings?.language },
  });

  // Theme form setup
  const themeForm = useForm<z.infer<typeof themeFormSchema>>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: { theme: userData?.userSettings?.isThemeDark },
  });

  const ctx = api.useUtils();

  // Update user settings mutation with onSuccess handler to update cache
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: (newData) => {
      const updatedData = {
        ...newData,
        loginHistories: ctx.user.byWallet
          .getData({ walletId })
          ?.loginHistories?.map((history) => ({
            ...history,
            _id: history._id.toString(),
          })),
      };
      ctx.user.byWallet.setData({ walletId }, updatedData);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  // Handle user settings update
  const handleUserSettingsUpdate = () => {
    const language = languageForm.getValues("language");
    const isThemeDark = themeForm.getValues("theme");

    updateUserMutation.mutate({
      walletId,
      userSettings: {
        language,
        isThemeDark,
      },
    });
  };

  return (
    <Form {...languageForm}>
      <form className="max-w-4/6 w-2/5 min-w-96 space-y-6">
        {/* Language Field */}
        <FormField
          control={languageForm.control}
          name="language"
          render={({ field }) => (
            <FormItem className="items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleUserSettingsUpdate();
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={field.value || "Select language"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="hover:cursor-pointer">
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Russian">Russian</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the language you would like to use
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Theme Field */}
        <FormField
          control={themeForm.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Theme</FormLabel>
                <FormDescription>
                  Toggle between light and dark mode
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleUserSettingsUpdate();
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
