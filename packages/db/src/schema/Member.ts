import { prop } from "@typegoose/typegoose";

export class MemberSchema {
  @prop({ required: true, type: String })
  public user!: string;

  @prop({ type: String, required: true, enum: ["observer", "admin", "owner"] })
  public role!: "observer" | "admin" | "owner";
}

// Since MemberSchema is used as a subdocument, it doesn’t require a separate model.
// embedding MemberSchema directly into ProjectClass, you eliminate the need for a separate MemberClass
