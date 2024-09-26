import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ schemaOptions: { collection: "projects" } })
export class ProjectClass extends TimeStamps {
  @prop({ default: "A user" })
  public user?: string;

  @prop({ default: "New Project" })
  public name?: string;

  @prop({ default: "New Project" })
  public image?: string;
}

// Create the Project model
export const Project =
  (mongoose.models.ProjectClass as
    | ReturnModelType<typeof ProjectClass>
    | undefined) ?? getModelForClass(ProjectClass);
