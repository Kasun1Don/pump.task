import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";

import { MemberClass } from "./Member";
import { StatusClass } from "./Status";

@modelOptions({ schemaOptions: { collection: "projects" } })
export class ProjectClass {
  @prop({ required: true })
  public name!: string;

  @prop()
  public image?: string;

  @prop({ required: true })
  public isPrivate!: boolean;

  @prop({ default: [], type: () => [StatusClass] })
  public status!: StatusClass[];

  @prop({ default: [], ref: () => MemberClass })
  public members!: Ref<MemberClass>[];

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}

export const Project =
  (mongoose.models.ProjectClass as
    | ReturnModelType<typeof ProjectClass>
    | undefined) ?? getModelForClass(ProjectClass);
