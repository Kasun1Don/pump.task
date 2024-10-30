import {
  getModelForClass,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

export class MemberClass {
  @prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public userId!: mongoose.Types.ObjectId;

  @prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  })
  public projectId!: mongoose.Types.ObjectId;

  @prop({
    required: true,
    type: String,
  })
  public walletId!: string;

  @prop({ required: true, enum: ["Observer", "Admin", "Owner"] })
  public role!: "Observer" | "Admin" | "Owner";
}

export const Member =
  (mongoose.models.MemberClass as
    | ReturnModelType<typeof MemberClass>
    | undefined) ?? getModelForClass(MemberClass);
