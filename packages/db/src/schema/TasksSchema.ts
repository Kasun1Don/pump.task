import type { Ref } from "@typegoose/typegoose";
import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { Project, ProjectClass } from "./Projects";
import { StatusClass } from "./StatusSchema";
import { TagsSchema } from "./TagsSchema";

class CustomField {
  @prop({ required: true })
  public fieldName!: string;

  @prop({ required: true })
  public fieldValue!: string;
}

export class TasksSchema {
  /* 
    Tags - References the 'TagsSchema' while running an additional check
    to make sure atleast 1 tag is selected (either default or custom tags).
  */
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

  // Title
  @prop({ required: true })
  public title!: string;

  // Description
  @prop({ required: true })
  public description!: string;

  // Due Date
  @prop({ required: true })
  public dueDate!: Date;

  // Assignee
  @prop({ required: true })
  public assignee!: string;

  // Custom Fields
  @prop({ type: () => [CustomField], required: false })
  public customFields?: CustomField[];

  // Reference to the Status ID
  @prop({ ref: () => StatusClass, required: true })
  public status!: Ref<StatusClass>;

  // Reference to the Project ID
  @prop({ ref: () => Project, required: true })
  public project!: Ref<ProjectClass>;
}

@modelOptions({ schemaOptions: { collection: "tasks" } })
export class TaskClass extends TasksSchema {}

export const Task =
  (mongoose.models.TaskClass as
    | ReturnModelType<typeof TaskClass>
    | undefined) ?? getModelForClass(TaskClass);
