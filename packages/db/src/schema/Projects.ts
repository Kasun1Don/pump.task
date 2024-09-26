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
  } 
})
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

  @prop({ required: false })
  public templateId?: string; // Change from ObjectId to string
}

export const Project =
  (mongoose.models.ProjectClass as
    | ReturnModelType<typeof ProjectClass>
    | undefined) ?? getModelForClass(ProjectClass);
