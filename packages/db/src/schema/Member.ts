import { prop } from "@typegoose/typegoose";

export class MemberSchema {
  @prop({ required: true, type: String })
  public user!: string;

  @prop({ required: true, enum: ["Observer", "Admin", "Owner"] })
  public role!: "Observer" | "Admin" | "Owner";

  @prop()
  public walletId?: string;

  @prop()
  public name?: string;

  @prop()
  public email?: string;
}

// Since MemberSchema is used as a subdocument, it doesn’t require a separate model.
// embedding MemberSchema directly into ProjectClass, you eliminate the need for a separate MemberClass
