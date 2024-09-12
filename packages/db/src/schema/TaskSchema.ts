import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { TagsSchema } from "./TagSchema";

export class TasksSchema {
  @prop({
    required: true,
    _id: false,
    validate: {
      validator: function (value: TagsSchema) {
        return (
          value.defaultTags.length > 0 ||
          (value.userGeneratedTags?.length ?? 0) > 0
        );
      },
      message:
        "At least one tag (either default or user-generated) is required.",
    },
  })
  public tags!: TagsSchema;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public dueDate!: string;

  @prop({ required: true })
  public status!: string;

  @prop({ required: true })
  public assignee!: string;

  @prop({
    type: () => [{ fieldName: String, fieldValue: String }],
    required: false,
  })
  public customFields?: { fieldName: string; fieldValue: string }[];
}

@modelOptions({ schemaOptions: { collection: "tasks" } })
export class TaskClass extends TasksSchema {}

export const Task =
  (mongoose.models.TaskClass as
    | ReturnModelType<typeof TaskClass>
    | undefined) ?? getModelForClass(TaskClass);
