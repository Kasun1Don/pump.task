import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { TasksSchema } from "./TasksSchema";

export class StatusSchema {
  @prop({ required: true })
  public name!: string;

  @prop({ type: () => [TasksSchema], default: [] })
  public tasks!: TasksSchema[];
}

@modelOptions({ schemaOptions: { collection: "status" } }) // specify collection name for mongoose
export class StatusClass extends StatusSchema {}

export const Status =
  (mongoose.models.StatusClass as
    | ReturnModelType<typeof StatusClass>
    | undefined) ?? getModelForClass(StatusClass);
