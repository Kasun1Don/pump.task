import Image from "next/image";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

interface BadgeDisplayModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProjectId: string | null;
  projectTags: Record<string, string[]> | undefined;
}

const images: Record<string, string> = {
  Backend: "/nfts/Backend.png",
  Design: "/nfts/Design.png",
  Misc: "/nfts/Misc.png",
  Frontend: "/nfts/Frontend.png",
  // if space in tag name, need to use quotes
  "Smart Contracts": "/nfts/Smart Contracts.png",
  Integration: "/nfts/Integration.png",
};

export function BadgeDisplayModal({
  isOpen,
  onOpenChange,
  selectedProjectId,
  projectTags,
}: BadgeDisplayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Available Badges</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 p-4">
          {selectedProjectId &&
            projectTags?.[selectedProjectId]?.map((tag) => {
              return (
                //create a container for each badge and the text
                <div key={tag} className="flex flex-col items-center">
                  <Image
                    // try find image using the tag name, if it fails, construct the path with tag name
                    src={images[tag] ?? `/nfts/${tag.replace(/\s+/g, "")}.png`}
                    alt={tag}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <span className="mt-2 text-sm text-gray-400">{tag}</span>
                </div>
              );
            })}
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
