"use client";

import type { z } from "zod";
import { useCallback, useEffect, useState } from "react";
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
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@acme/ui/input-otp";
import { Label } from "@acme/ui/label";
import { Switch } from "@acme/ui/switch";
import { toast } from "@acme/ui/toast";
import { securityFormSchema } from "@acme/validators";

import { send2FAEmail, verify2FACode } from "~/app/actions/2FAFunctions";
import { updateUserSettings } from "~/app/actions/handleUserUpdate";
import { api } from "~/trpc/react";

export default function Security({
  emailVerified,
  authentication,
  walletId,
}: {
  emailVerified: boolean | undefined;
  authentication: boolean | undefined;
  walletId: string;
}): JSX.Element {
  // State for the success message
  const [successMessage, setSuccessMessage] = useState(false);

  // State for the email code sent
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [value, setValue] = useState("");

  // State for the error message
  const [errorMessage, setErrorMessage] = useState("");

  // State for loading state
  const [loading, setLoading] = useState(false);

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

  const onSubmitSend = async () => {
    setLoading(true);
    const response = await send2FAEmail(walletId);
    setLoading(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return;
    }
    setEmailCodeSent(true);
  };

  const onSubmitVerify = useCallback(async () => {
    setLoading(true);
    const response = await verify2FACode(walletId, value);
    setLoading(false);
    if (response.success) {
      void handleUserSettingsUpdate();
      setSuccessMessage(true);
      setErrorMessage("");
    } else {
      setErrorMessage(response.message);
      setValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (value.length === 6) {
      onSubmitVerify().catch((error) => {
        console.error("Error verifying 2FA code:", error);
      });
    }
    if (value.length > 0) {
      setErrorMessage("");
    }
  }, [value, onSubmitVerify]);

  const handleUserSettingsUpdate = async () => {
    try {
      const authentication = securityForm.getValues("authentication");
      let settingsToUpdate;

      settingsToUpdate = {
        walletId,
        twoFactorAuth: authentication,
      };

      if (authentication === false) {
        setEmailCodeSent(false);
        settingsToUpdate = {
          walletId,
          twoFactorAuth: authentication,
          emailVerified: false,
        };
      }

      const response = await updateUserSettings(settingsToUpdate);

      if (response instanceof Error) {
        throw response;
      }
    } catch (error) {
      toast.error(`Failed to update settings. Please try again.`);
      console.error("Error updating user settings:", error);
      securityForm.reset({
        authentication: authentication,
      });
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
                {field.value ? (
                  emailVerified ? (
                    <p className="text-zesty-green">Verified</p>
                  ) : (
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
                                className="bg-zesty-green sm:justify-center"
                                type="button"
                                onClick={onSubmitSend}
                                disabled={loading}
                              >
                                {loading ? "Sending..." : "Send Code"}
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
                            <div className="flex flex-col items-center gap-4">
                              {successMessage ? (
                                <p className="text-green-500">Success!</p>
                              ) : (
                                <>
                                  <FormItem className="flex flex-col items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <InputOTP
                                          maxLength={6}
                                          value={value}
                                          onChange={(value) => setValue(value)}
                                        >
                                          <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                          </InputOTPGroup>
                                        </InputOTP>
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Verify your identity by entering the code
                                      sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                    {errorMessage && (
                                      <p className="text-xs text-red-500">
                                        {errorMessage}
                                      </p>
                                    )}
                                  </FormItem>
                                  <DialogFooter>
                                    <Button
                                      className="bg-zesty-green sm:justify-center"
                                      type="button"
                                      onClick={() => setEmailCodeSent(false)}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      className="bg-zesty-green sm:justify-center"
                                      type="button"
                                      onClick={onSubmitVerify}
                                      disabled={loading}
                                    >
                                      {loading ? "Verifying..." : "Submit"}
                                    </Button>
                                  </DialogFooter>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )
                ) : null}
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
