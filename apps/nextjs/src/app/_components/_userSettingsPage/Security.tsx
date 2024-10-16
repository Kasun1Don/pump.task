"use client";

import type { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/accordion";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Switch } from "@acme/ui/switch";
import { securityFormSchema } from "@acme/validators";

import { api } from "~/trpc/react";

export default function Security({
  emailVerified,
  authentication,
  walletId,
  email,
}: {
  emailVerified: boolean | undefined;
  authentication: boolean | undefined;
  walletId: string;
  email: string | undefined;
}): JSX.Element {
  console.log("Console loggin to not throw unused variable lint error", email);
  const [emailCodeSent, setEmailCodeSent] = useState(false);

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      authentication: authentication,
    },
  });

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
                {field.value && !emailVerified ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-zesty-green ml-4 text-sm"
                      >
                        Verify Now
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Secure your account</DialogTitle>
                        <DialogDescription>
                          Enter your email address to receive a verification
                          code.
                        </DialogDescription>
                      </DialogHeader>
                      {!emailCodeSent ? (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              defaultValue={userData?.email ?? ""}
                              className="col-span-3"
                              disabled={true}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              className="sm\:justify-center bg-zesty-green"
                              type="submit"
                              onClick={() => setEmailCodeSent(!emailCodeSent)}
                            >
                              Send Code
                            </Button>
                          </DialogFooter>
                        </div>
                      ) : (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              value={userData?.email ?? ""}
                              className="col-span-3"
                              disabled={true}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                              Code
                            </Label>
                            <Input id="code" className="col-span-3" />
                          </div>
                          <DialogFooter>
                            <Button
                              className="sm\:justify-center bg-zesty-green"
                              type="submit"
                              onClick={() => setEmailCodeSent(!emailCodeSent)}
                            >
                              Submit
                            </Button>
                          </DialogFooter>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ) : field.value && emailVerified ? (
                  <p className="text-zesty-green">Verified</p>
                ) : null}
                <FormControl>
                  <Switch
                    className={field.value ? "bg-zesty-green" : "bg-gray-200"}
                    checked={field.value}
                    onCheckedChange={(checked: boolean) => {
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
                    <button type="button" className="text-zesty-green text-sm">
                      Show History
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-1/2 h-fit overflow-y-scroll p-4">
                    <DialogHeader>
                      <DialogTitle>Login History</DialogTitle>
                    </DialogHeader>
                    <Accordion type="single" collapsible>
                      {isLoading ? (
                        <p>Loading...</p>
                      ) : isError ? (
                        <p>Error loading login history.</p>
                      ) : userData?.loginHistories ? (
                        userData.loginHistories.map((history, index) => (
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
                                    ? new Date(
                                        history.createdAt,
                                      ).toLocaleString()
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
                        ))
                      ) : (
                        <p>No login history available.</p>
                      )}
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
