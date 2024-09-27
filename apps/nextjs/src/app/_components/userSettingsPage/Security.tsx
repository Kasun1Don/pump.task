"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/form";
import { Switch } from "@acme/ui/switch";

import { api } from "~/trpc/react";

// Define schema for security form
const securityFormSchema = z.object({
  authentication: z.boolean().default(false).optional(),
  viewLoginHistory: z.boolean().default(false).optional(),
});

export default function Security({
  emailVerified,
  authentication,
  walletId,
}: {
  emailVerified: boolean | undefined;
  authentication: boolean | undefined;
  walletId: string;
}): JSX.Element {
  if (emailVerified) {
    authentication = true;
  }

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      authentication: authentication,
    },
  });

  /* 

  If the emailVerifed is false, then the user should be able to enable 2FA

  If the authencation is true, but the emailVerified is false, then the verify now button should be enabled
  If the authencation is true and the emailVerified is true, then a verified text should be diabled

 

  1. check 

*/

  // If the emailVerified is true, then the user should be able to disable 2FA

  // If the user disables 2FA

  const {
    data: userData,
    isLoading: isLoading,
    isError: isError,
  } = api.loginHistory.loginHistories.useQuery({
    walletId,
  });

  const handleAuthenticationChange = (checked: boolean) => {
    if (checked) {
      console.log("2FA authentication enabled");
      return;
    } else {
      console.log("2FA authentication disabled");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching user data.");
    return <div>Error loading user data</div>;
  }

  return (
    <Form {...securityForm}>
      <form className="max-w-4/6 w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg border bg-zinc-950 p-3 shadow-sm">
        <h1>Security</h1>

        {/* Enable 2FA Authentication */}
        <FormField
          control={securityForm.control}
          name="authentication"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable 2FA Authentication</FormLabel>
                <FormDescription>
                  Require two-factor authentication to log in.
                </FormDescription>
              </div>
              <div className="flex items-center justify-center gap-6">
                {field.value ? (
                  !emailVerified ? (
                    <button
                      type="button"
                      className="text-zesty-green ml-4 text-sm"
                    >
                      Verify Now
                    </button>
                  ) : (
                    <p className="text-zesty-green">Verified</p>
                  )
                ) : null}
                <FormControl>
                  <Switch
                    className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      handleAuthenticationChange(checked);
                    }}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* View Login History */}
        <FormField
          control={securityForm.control}
          name="viewLoginHistory"
          render={() => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>View Login History</FormLabel>
                <FormDescription>View your login history</FormDescription>
              </div>
              <FormControl>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-zesty-green ml-6 text-sm"
                    >
                      Show History
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-1/2 h-fit overflow-y-scroll p-4">
                    <DialogHeader>
                      <DialogTitle>Login History</DialogTitle>
                    </DialogHeader>
                    <Accordion type="single" collapsible>
                      {userData?.loginHistories.map((history, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="mb-4 rounded-lg border bg-zinc-950 p-3 shadow-sm"
                        >
                          <AccordionTrigger>
                            {history.createdAt
                              ? new Date(history.createdAt).toLocaleString()
                              : "Date not available"}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p>
                                <strong>Date: </strong>
                                {history.createdAt
                                  ? new Date(history.createdAt).toLocaleString()
                                  : "N/A"}
                              </p>
                              <p>
                                <strong>Location: </strong>
                                {history.location ?? "unknown"}
                              </p>
                              <p>
                                <strong>Browser: </strong>
                                {history.browser ?? "unknown"}
                              </p>
                              <p>
                                <strong>Operating System: </strong>
                                {history.operatingSystem ?? "unknown"}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </DialogContent>
                </Dialog>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
