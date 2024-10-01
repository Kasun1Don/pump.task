import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

export enum Skill {
  Backend = "backend",
  Frontend = "frontend",
}

@modelOptions({ schemaOptions: { collection: "badges" } })
export class BadgeClass {
  @prop({ enum: Skill, required: true })
  public skill: Skill;

  @prop({ required: true, default: () => new mongoose.Types.ObjectId() })
  public id: mongoose.Types.ObjectId;

  @prop({ required: true })
  public receivedDate: Date;

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
