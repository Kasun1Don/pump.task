import type mongoose from "mongoose";

export interface Member {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  walletId: string;
  role: "Observer" | "Admin" | "Owner";
}
