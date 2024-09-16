import { mongoose, prop } from "@typegoose/typegoose";

export class MemberSchema {
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public user!: mongoose.Types.ObjectId;

  @prop({ required: true, enum: ["observer", "admin", "owner"] })
  public role!: "observer" | "admin" | "owner";
}

//Since MemberSchema is used as a subdocument, it doesn’t require a separate model.
// embedding MemberSchema directly into ProjectClass, you eliminate the need for a separate MemberClass
