import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import { api } from "~/trpc/react";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  onSuccess?: () => void;
}

export function DeleteProjectDialog({
  isOpen,
  onOpenChange,
  projectId,
  onSuccess,
}: DeleteProjectDialogProps) {
  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      console.log("Project deleted successfully");
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });

  const handleDelete = () => {
    if (projectId) {
      deleteProject.mutate({ projectId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleDelete();
          }
        }}
        tabIndex={0}
        role="alertdialog"
      >
        <DialogHeader>
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogDescription id="delete-dialog-description" className="py-2">
            <p>Are you sure you want to permanently delete this project?</p>
            <p className="mt-2">You can't undo this action.</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
