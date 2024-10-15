import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { TaskClass } from "./TasksSchema";

export class StatusSchema {
  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: () => [TaskClass], default: [] })
  public tasks!: TaskClass[];
}

@modelOptions({ schemaOptions: { collection: "status" } })
export class StatusClass extends StatusSchema {}

export const Status =
  (mongoose.models.StatusClass as
    | ReturnModelType<typeof StatusClass>
    | undefined) ?? getModelForClass(StatusClass);
