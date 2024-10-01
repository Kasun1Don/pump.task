"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
// import { CreatePostSchema } from "@acme/validators";

import { Dialog, DialogContent, DialogTrigger } from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

export const AddMemberSchema = z.object({
  walletId: z.string(),
  projectId: z.string(),
  role: z.string(),
});

export function AddMember({ projectId }: { projectId: string }) {
  const form = useForm({
    schema: AddMemberSchema,
    defaultValues: {
      walletId: "",
      role: "observer",
      projectId,
    },
  });

  const utils = api.useUtils();
  const updateMembers = api.project.editMembers.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.project.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to post"
          : "Failed to create post",
      );
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-h-[40px] w-full bg-transparent text-white hover:bg-[#27272a]">
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex w-full max-w-2xl flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
              updateMembers.mutate(data);
              setIsOpen(false);
            })}
          >
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Wallet Id" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <Label>
                      <input
                        type="radio"
                        value="Admin"
                        checked={field.value === "Admin"}
                        onChange={field.onChange}
                      />
                      Admin
                    </Label>
                    <Label>
                      <input
                        type="radio"
                        value="Observer"
                        checked={field.value === "Observer"}
                        onChange={field.onChange}
                      />
                      Observer
                    </Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Add member</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
