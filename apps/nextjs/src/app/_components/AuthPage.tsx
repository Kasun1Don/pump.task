"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/button";
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
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";
import { send2FAEmail, verify2FACode } from "../actions/2FAFunctions";

const formSchema = z.object({
  email: z.string(),
});

export default function UserLoginClient({
  email,
  wallet,
  locationData,
  userHas2FAEnabled,
}: {
  email: string | undefined;
  userHas2FAEnabled: boolean | undefined;
  wallet: string;
  locationData: string;
}) {
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = api.user.login.useMutation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });

  const onSubmitSend = async () => {
    setLoading(true);
    const response = await send2FAEmail(wallet);
    setLoading(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return;
    }
    toast.success("Email sent successfully!");
    setEmailCodeSent(true);
  };

  const onSubmitVerify = useCallback(async () => {
    setLoading(true);
    const response = await verify2FACode(wallet, value);
    setLoading(false);
    if (response.success) {
      toast.success("Code verified successfully!, Redireting to profile...");
      setSuccessMessage(true);
      setUserAuthenticated(true);
      router.push("/profile");
    } else {
      setErrorMessage(response.message);
      setValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleLogin = async () => {
    try {
      const userAgentArray = navigator.userAgent.split(" ");
      await mutation.mutateAsync({
        walletId: wallet,
        browser: userAgentArray[userAgentArray.length - 2],
        operatingSystem: navigator.platform,
        location: locationData,
      });
      toast.success("Login successful!, Redirecting to profile...");
      setSuccessMessage(true);
      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      router.push("/");
    }
  };

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

  useEffect(() => {
    if (!userHas2FAEnabled || userAuthenticated) {
      handleLogin().catch((error) => {
        console.error("Error handling login:", error);
      });
    } else {
      setIs2FAOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthenticated]);

  return (
    <>
      {is2FAOpen ? (
        !emailCodeSent ? (
          <div className="mt-[30vh] flex h-screen items-start justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => onSubmitSend())}
                className="max-w-4/6 flex min-w-[450px] items-center justify-between space-y-6 rounded-lg bg-zinc-950 p-3 shadow-sm first:flex-col"
              >
                <h1>Two Factor Authentication</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="items-left flex w-full flex-col justify-between gap-4 rounded-lg border bg-zinc-950 p-3 shadow-sm">
                      {!loading ? (
                        <>
                          <FormLabel>Linked Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            This is where your code will be sent.
                          </FormDescription>
                          <FormMessage />
                        </>
                      ) : (
                        <div className="flex items-center justify-center">
                          <p>Loading...</p>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-zesty-green">
                  Send Code
                </Button>
                <Link href={"/"} className="text-xxs hover:underline">
                  I Don't have access to this Email
                </Link>
              </form>
            </Form>
          </div>
        ) : (
          <div className="mt-[30vh] flex h-screen items-start justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => onSubmitVerify())}
                className="max-w-4/6 flex w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg bg-zinc-950 p-3 shadow-sm first:flex-col"
              >
                <h1>Two Factor Authentication</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem className="flex flex-col items-center justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
                      {successMessage ? (
                        <p className="text-green-500">Success!</p>
                      ) : !loading ? (
                        <>
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
                            Verify your identity by entering the code sent to
                            your email.
                          </FormDescription>
                          <FormMessage />
                          {errorMessage && (
                            <p className="text-xs text-red-500">
                              {errorMessage}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center">
                          <p>Loading...</p>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <Link href={"/"} className="text-xxs hover:underline">
                  I Don't have access to this Email
                </Link>
              </form>
            </Form>
          </div>
        )
      ) : null}
    </>
  );
}
