import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import { revalidate } from "~/app/actions/revalidate";
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
  // TRPC utility function to invalidate cache data
  const utils = api.useUtils();

  const deleteProject = api.project.delete.useMutation({
    onSuccess: async () => {
      console.log("Project deleted successfully");
      // invalidate and refetch user data
      await utils.user.byWallet.invalidate();
      await revalidate("/");
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
