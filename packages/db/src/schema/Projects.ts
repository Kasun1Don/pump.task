import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { MemberSchema } from "./Member";
import { StatusSchema } from "./Status";

@modelOptions({
  schemaOptions: {
    collection: "projects",
    timestamps: true,
  },
})
export class ProjectClass {
  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String })
  public image?: string;

  @prop({ type: Boolean, required: true })
  public isPrivate!: boolean;

  @prop({ type: () => [MemberSchema], default: [] })
  public members!: MemberSchema[];

  @prop({ type: () => [StatusSchema], default: [] })
  public status!: StatusSchema[];

  @prop({ type: String, required: false })
  public templateId?: string;
}

export const Project =
  (mongoose.models.ProjectClass as
    | ReturnModelType<typeof ProjectClass>
    | undefined) ?? getModelForClass(ProjectClass);
