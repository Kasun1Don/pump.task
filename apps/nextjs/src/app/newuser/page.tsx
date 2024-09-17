"use client";

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
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

// export default function NewUser() {
//   const router = useRouter();
//   return (
//     <div className="container flex h-screen max-w-5xl flex-col items-center gap-5 py-16 text-center">
//       <h1>Welcome</h1>
//       <h2>What should we call you?</h2>
//       <Input className="w-64 text-center" />
//       <Button onClick={() => router.push("/dashboard")}>Submit</Button>
//     </div>
//   );
// }

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
  const { data, error, isLoading } = api.user.byWallet.useQuery({
    walletId: address,
  });
  const router = useRouter();

  console.log(error);

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      name: "",
    },
  });

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      console.log("success");
      router.push("/projects");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to post"
          : "Failed to create post",
      );
    },
  });

  if (data && !data.error) {
    router.push("/projects");
  }

  console.log("look here", isLoading);
  if (isLoading) {
    return <p>loading...</p>;
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    createUser.mutate({ ...data, walletId: address });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should we call you?</FormLabel>
              <FormControl>
                <Input {...field} />
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
