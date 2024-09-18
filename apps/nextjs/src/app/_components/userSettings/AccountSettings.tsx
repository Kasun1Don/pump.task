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

const languageFormSchema = z.object({
  language: z
    .string({
      required_error: "Please select a language.",
    })
    .default("English"),
});

const themeFormSchema = z.object({
  theme: z.boolean().default(false).optional(),
});

export default function AccountSettings() {
  const languageForm = useForm<z.infer<typeof languageFormSchema>>({
    resolver: zodResolver(languageFormSchema),
  });

  const themeForm = useForm<z.infer<typeof themeFormSchema>>({
    resolver: zodResolver(themeFormSchema),
  });

  return (
    <Form {...languageForm}>
      <form className="max-w-4/6 w-1/2 min-w-96 space-y-6">
        {/* Language Field */}
        <FormField
          control={languageForm.control}
          name="language"
          render={({ field }) => (
            <FormItem className="items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={field.value || "Select language"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="hover:cursor-pointer">
                  <SelectItem className="hover:cursor-pointer" value="English">
                    English
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="Spanish">
                    Spanish
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="French">
                    French
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="German">
                    German
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="Chinese">
                    Chinese
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="Russian">
                    Russian
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="Korean">
                    Korean
                  </SelectItem>
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
                  Choose between light and dark mode
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className={field.value ? "bg-lime-700" : "bg-gray-200"}
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
