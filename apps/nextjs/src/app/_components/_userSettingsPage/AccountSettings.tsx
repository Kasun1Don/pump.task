"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { toast } from "@acme/ui/toast";
import { languageFormSchema, themeFormSchema } from "@acme/validators";

import { updateUserSettings } from "~/app/actions/handleUserUpdate";

export default function AccountSettings({
  language,
  theme,
  walletId,
}: {
  language: string | undefined;
  theme: boolean | undefined;
  walletId: string;
}) {
  const languageForm = useForm({
    resolver: zodResolver(languageFormSchema),
    defaultValues: { language: language },
  });

  const themeForm = useForm({
    resolver: zodResolver(themeFormSchema),
    defaultValues: { theme: theme },
  });

  const handleUserSettingsUpdate = async () => {
    try {
      const language = languageForm.getValues("language");
      const isThemeDark = themeForm.getValues("theme");

      const settingsToUpdate = {
        walletId,
        language,
        isThemeDark,
      };

      const response = await updateUserSettings(settingsToUpdate);

      if (response instanceof Error) {
        throw response;
      }
    } catch (err) {
      toast.error("Failed to update user settings. Please try again.");
      console.error("Error updating user settings:", err);

      languageForm.reset();
      themeForm.reset();
    }
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
                  void handleUserSettingsUpdate();
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={field.value} />
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
