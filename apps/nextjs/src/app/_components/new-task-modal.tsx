"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@acme/ui/select";

const NewTaskModal = () => {
  const [date, setDate] = React.useState<Date>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 text-white">+ New task</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[50vw] flex-col overflow-auto rounded-lg bg-gray-900 p-6 text-white">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        {/* Tags */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="mb-2">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Frontend",
              "Backend",
              "Design",
              "Smart Contracts",
              "Integration",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-700 px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}

        {/* Description */}
        <div className="mb-4 flex-grow">
          <h3 className="mb-2">DESCRIPTION</h3>
          <Input
            placeholder="Enter detailed task description."
            className="h-24 w-full"
          ></Input>
        </div>

        {/* Due Date */}
        <div className="mb4 flex-shrink-0">
          <h3 className="mb2">DUE DATE</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <Image
                  src="/calendar.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="mr-2 h-4 w-4"
                />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Status and Assignee */}
        <div className="mb-6 flex flex-shrink-0 gap-4">
          <div className="w-1/2">
            <h3 className="mb-2">STATUS</h3>
            <Select>
              <SelectTrigger className="w-full">To Do</SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="inqa">In QA</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <h3 className="mb-2">ASSIGNEE</h3>
            <Select>
              <SelectTrigger className="w-full">Unassigned</SelectTrigger>
              <SelectContent>
                <SelectItem value="assigntome">Assign to me</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          style={{ backgroundColor: "var(--ZESTY-GREEN, #72D524)" }}
          className="w-full text-black"
        >
          Create task
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
