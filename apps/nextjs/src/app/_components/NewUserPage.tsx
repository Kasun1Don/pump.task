"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

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
  email: z.string().email({ message: "Invalid email address" }),
  image: z.string().optional(),
  bio: z.string().optional(),
});

export default function NewUserPage({ wallet }: { wallet: string }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>("");

  console.log(wallet);

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      name: "",
      email: "",
      image: "/userIcons/purple.svg",
      bio: "",
    },
  });

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    const walletId = wallet;
    const { name, email, bio } = data;

    createUser.mutate({
      walletId,
      name,
      email,
      image: selectedImage || data.image,
      bio,
    });
  }

  return (
    <div className="bg-custom-bg container flex h-screen items-center justify-center bg-cover bg-center py-16 text-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container flex h-fit w-full max-w-5xl flex-col items-center gap-12 rounded-lg border bg-[rgba(0,0,0,0.5)] p-3 py-16 text-center shadow-sm"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What should we call you?</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" className="w-64" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we contact you?</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="w-64" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us a bit about yourself?</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-64 w-96 align-text-top"
                    placeholder="Let other users know a bit about you!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Select a Profile Icon</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center space-x-10 p-5">
                    {["purple", "blue", "red", "green", "orange", "teal"].map(
                      (color) => (
                        <Image
                          key={color}
                          className={`hover:cursor-pointer ${
                            selectedImage === `/userIcons/${color}.svg`
                              ? "rounded-full border-x border-y border-white"
                              : ""
                          }`}
                          src={`/userIcons/${color}.svg`}
                          alt={`${color} icon`}
                          width={40}
                          height={40}
                          onClick={() =>
                            setSelectedImage(`/userIcons/${color}.svg`)
                          }
                        />
                      ),
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
