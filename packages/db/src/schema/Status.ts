import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { TaskClass } from "./TaskSchema";

export class StatusSchema {
  @prop({ required: true })
  public name!: string;

  @prop({ type: () => [TaskClass], default: [] })
  public tasks!: TaskClass[];
}

@modelOptions({ schemaOptions: { collection: "status" } }) // specify collection name for mongoose
export class StatusClass extends StatusSchema {}

export const Status =
  (mongoose.models.StatusClass as
    | ReturnModelType<typeof StatusClass>
    | undefined) ?? getModelForClass(StatusClass);
