import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

export enum Skill {
  Backend = "Backend",
  Frontend = "Frontend",
  Design = "Design",
  SmartContracts = "Smart Contracts",
  Integration = "Integration",
  JSNinja = "JS Ninja",
  Misc = "Misc.",
}

@modelOptions({ schemaOptions: { collection: "badges" } })
export class BadgeClass {
  @prop({ enum: Skill, required: true })
  public skill: Skill;

  @prop({ required: true, default: () => new mongoose.Types.ObjectId() })
  public id: mongoose.Types.ObjectId;

  @prop({ type: Date, required: true })
  public receivedDate: Date;

  @prop({ type: String, required: true })
  public nftImage?: string;

  constructor(skill: Skill, receivedDate: Date) {
    this.skill = skill;
    this.id = new mongoose.Types.ObjectId();
    this.receivedDate = receivedDate;
  }
}

// Create the badge model
export const Badge =
  (mongoose.models.BadgeClass as
    | ReturnModelType<typeof BadgeClass>
    | undefined) ?? getModelForClass(BadgeClass);
