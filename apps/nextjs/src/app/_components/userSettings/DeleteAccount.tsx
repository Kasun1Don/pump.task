"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@acme/ui/alert-dialog";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/form";

// Ensure you have this import

const deleteAccountFormSchema = z.object({
  deleteAccount: z.boolean().default(false).optional(),
});

export default function DeleteAccount() {
  const deleteAccountForm = useForm<z.infer<typeof deleteAccountFormSchema>>({
    resolver: zodResolver(deleteAccountFormSchema),
  });

  const onDeleteConfirm = () => {
    console.log("Account deleted");
    deleteAccountForm.reset();
  };

  return (
    <Form {...deleteAccountForm}>
      <form className="max-w-4/6 w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg border bg-zinc-950 p-3 shadow-sm">
        <FormField
          control={deleteAccountForm.control}
          name="deleteAccount"
          render={() => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Remove Account</FormLabel>
                <FormDescription>Remove your Pump.Task account</FormDescription>
              </div>
              <div className="flex items-center justify-center gap-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-zesty-green hover:bg-zesty-green">
                      Remove Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and may result in loss of Badges.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-zesty-green hover:bg-zesty-green"
                        onClick={onDeleteConfirm}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
