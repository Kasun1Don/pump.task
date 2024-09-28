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

// Custom field name & values (Used when user adds a custom field to the task form)
class CustomField {
  @prop({ required: true })
  public fieldName!: string;

  @prop({ required: true })
  public fieldValue!: string;
}

@modelOptions({
  schemaOptions: {
    collection: "tasks",
    timestamps: true, // Enables automatic createdAt and updatedAt fields
  },
})
export class TasksSchema {
  // Tags for categorizing tasks (includes default and user-generated)
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

  // Title of the task
  @prop({ required: true })
  public title!: string;

  // Description of the task
  @prop({ required: true })
  public description!: string;

  // Due Date for the task
  @prop({ required: true })
  public dueDate!: Date;

  // Assignee (User assigned to the task)
  @prop({ required: true })
  public assignee!: string;

  // Custom Fields for additional information
  @prop({ type: () => [CustomField], required: false })
  public customFields?: CustomField[];

  // Reference to the Status the task belongs to
  @prop({ ref: () => StatusClass, required: true })
  public status!: Ref<StatusClass>;

  // Reference to the Project the task belongs to
  @prop({ ref: () => Project, required: true })
  public project!: Ref<ProjectClass>;

  // Order of the task within column (Used to arrange location of task within status column)
  @prop({ required: true })
  public order!: number;
}

export const Task =
  (mongoose.models.TaskClass as
    | ReturnModelType<typeof TasksSchema>
    | undefined) ?? getModelForClass(TasksSchema);
