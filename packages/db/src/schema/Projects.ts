import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { MemberSchema } from "./Member";
import { StatusSchema } from "./Status";

@modelOptions({ schemaOptions: { collection: "projects" } })
export class ProjectClass {
  @prop({ required: true })
  public name!: string;

  @prop()
  public image?: string;

  @prop({ required: true })
  public isPrivate!: boolean;

  @prop({ type: () => [MemberSchema], default: [] })
  public members!: MemberSchema[];

  @prop({ type: () => [StatusSchema], default: [] })
  public status!: StatusSchema[];

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;

  @prop({ required: false })
  public templateId?: string; // Change from ObjectId to string
}

export const Project = getModelForClass(ProjectClass);
