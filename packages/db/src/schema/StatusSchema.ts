import type { Ref } from "@typegoose/typegoose";
import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { ProjectClass } from "./Projects";

@modelOptions({ schemaOptions: { collection: "status" } })
export class StatusClass {
  // Status Name
  @prop({ required: true })
  public name!: string;

  // Reference to the Project ID
  @prop({ ref: () => ProjectClass, required: true })
  public project!: Ref<ProjectClass>;
}

export const Status =
  (mongoose.models.StatusClass as
    | ReturnModelType<typeof StatusClass>
    | undefined) ?? getModelForClass(StatusClass);
