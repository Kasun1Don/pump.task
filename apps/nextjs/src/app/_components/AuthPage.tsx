"use client";

import { useEffect, useState } from "react";
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

import { api } from "~/trpc/react";
import Send2FAEmail from "../actions/send2FAEmail";

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
  const [userAuthenticated] = useState(false);
  const [value, setValue] = useState("");
  const mutation = api.user.login.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });

  function onSubmitSend() {
    try {
      console.log("Sending 2FA email...");
      const response = Send2FAEmail(wallet);
      setEmailCodeSent(true);
      console.log(response);
    } catch (error) {
      console.error("Error sending 2FA email:", error);
    }
  }

  function onSubmitVerify() {
    try {
      console.log("Verifying 2FA code...");
      console.log(value);

      // setUserAuthenticated(true);
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
    }
  }

  const handleLogin = async () => {
    try {
      const userAgentArray = navigator.userAgent.split(" ");
      await mutation.mutateAsync({
        walletId: wallet,
        browser: userAgentArray[userAgentArray.length - 2],
        operatingSystem: navigator.platform,
        location: locationData,
      });

      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    console.log("User has 2FA enabled:", userHas2FAEnabled);
    console.log("User authenticated:", userAuthenticated);
    if (userHas2FAEnabled || userAuthenticated) {
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
                className="max-w-4/6 flex w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg border bg-zinc-950 p-3 shadow-sm first:flex-col"
              >
                <h1>Two Factor Authentication Enabled</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="items-left flex flex-col justify-between rounded-lg border bg-zinc-950 p-3 shadow-sm">
                      <FormLabel>Linked Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        This is where your code will be sent.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Send Code</Button>
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
                className="max-w-4/6 flex w-2/5 min-w-96 items-center justify-between space-y-6 rounded-lg border bg-zinc-950 p-3 shadow-sm first:flex-col"
              >
                <h1>Two Factor Authentication Enabled</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
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
                        Verify your identity by entering the code sent to your
                        email.
                      </FormDescription>
                      <FormMessage />
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
