import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { collection: "projects" } })
export class ProjectClass extends TimeStamps {
  @prop({ type: () => String, auto: true })
  public _id?: Types.ObjectId;

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
