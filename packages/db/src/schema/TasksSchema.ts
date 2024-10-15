import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { TagsSchema } from "./TagsSchema";

class CustomField {
  @prop({ type: String, required: true })
  public fieldName!: string;

  @prop({ type: String, required: true })
  public fieldValue!: string;
}

export class TasksSchema {
  @prop({
    required: true,
    _id: false,
    type: () => TagsSchema,
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

  @prop({ type: String, required: true })
  public title!: string;

  @prop({ type: String, required: true })
  public description!: string;

  @prop({ type: String, required: true })
  public dueDate!: string;

  @prop({ type: String, required: true })
  public status!: string;

  @prop({ type: String, required: true })
  public assignee!: string;

  @prop({ type: () => [CustomField], _id: false, required: false })
  public customFields?: CustomField[];
}

@modelOptions({ schemaOptions: { collection: "tasks" } })
export class TaskClass extends TasksSchema {}

// Create the Task model
export const Task =
  (mongoose.models.TaskClass as
    | ReturnModelType<typeof TaskClass>
    | undefined) ?? getModelForClass(TaskClass);
