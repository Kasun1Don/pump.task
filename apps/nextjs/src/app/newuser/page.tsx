"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

// import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must only contain letters and spaces",
    }),
});

export default function NewUser() {
  const account = useActiveAccount();
  console.log(account);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
  const address = account?.address!;
  const { data, isLoading } = api.user.byWallet.useQuery({
    walletId: address,
  });
  const router = useRouter();

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      name: "",
    },
  });
  useEffect(() => {
    if (data) {
      router.push("/projects");
    }
  }, [data, router]);

  // const createUser = api.user.create.useMutation({
  //   onSuccess: () => {
  //     console.log("success");
  //     router.push("/projects");
  //   },
  //   onError: (err) => {
  //     toast.error(
  //       err.data?.code === "UNAUTHORIZED"
  //         ? "You must be logged in to post"
  //         : "Failed to create post",
  //     );
  //   },
  // });

  if (isLoading || (data && !data.error)) {
    return <p>loading...</p>;
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    // createUser.mutate({ ...data, walletId: address });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container flex h-screen max-w-5xl flex-col items-center gap-5 py-16 text-center"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should we call you?</FormLabel>
              <FormControl>
                <Input className="w-64 text-center" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
