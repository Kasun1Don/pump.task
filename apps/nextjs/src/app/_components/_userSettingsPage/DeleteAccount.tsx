"use client";

import type { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

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
import { toast } from "@acme/ui/toast";
import { deleteAccountFormSchema } from "@acme/validators";

import { logout } from "~/app/actions/authFront";
import { api } from "~/trpc/react";

export default function DeleteAccount({
  walletId,
}: {
  walletId: string;
}): JSX.Element {
  const deleteAccountForm = useForm<z.infer<typeof deleteAccountFormSchema>>({
    resolver: zodResolver(deleteAccountFormSchema),
  });

  const router = useRouter();

  const mutation = api.user.delete.useMutation();

  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  const onDeleteConfirm = async () => {
    try {
      const response = await mutation.mutateAsync({
        walletId: walletId,
      });

      if (response instanceof Error) {
        throw response;
      }
      if (wallet) {
        disconnect(wallet);
        await logout();
        router.push("/");
      } else {
        await logout();
        router.push("/");
      }
    } catch (error) {
      toast.error("Error deleting account");
      console.error("Error deleting account:", error);
    }
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
                    <Button className="bg-zesty-green">Remove Account</Button>
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
                        className="bg-red-600 hover:bg-red-700"
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
