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

import { revalidate } from "~/app/actions/revalidate";
import { api } from "~/trpc/react";

export const AddMemberSchema = z.object({
  email: z.string(),
  projectId: z.string(),
  role: z.string(),
});

export function AddMember({ projectId }: { projectId: string }) {
  const form = useForm({
    schema: AddMemberSchema,
    defaultValues: {
      email: "",
      // role: "observer",
      projectId,
    },
  });

  const updateMembers = api.project.editMembers.useMutation({
    onSuccess: async () => {
      await revalidate(`/users/${projectId}`);
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(
        err.message ? err.message : "Failed to create post",
        // err.data?.code === "UNAUTHORIZED"
        //   ? "You must be logged in to post"
        //   : "Failed to create post",
      );
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center self-end rounded-lg border border-gray-700 bg-[#72D524] p-1 font-bold hover:bg-[#5CAB1D]">
          + Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex w-full max-w-2xl flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
              updateMembers.mutate(data);
            })}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
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
