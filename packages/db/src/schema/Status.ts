import type { Ref } from "@typegoose/typegoose";
import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { ProjectClass } from "./Projects";

@modelOptions({
  schemaOptions: {
    collection: "status",
    timestamps: true, // Enables automatic createdAt and updatedAt fields
  },
})
export class StatusClass {
  // Status Name (e.g., "To Do", "In Progress", "Done")
  @prop({ required: true })
  public name!: string;

  // Reference to the Project ID (Which project this status belongs to)
  @prop({
    type: () => mongoose.Schema.Types.ObjectId,
    ref: () => ProjectClass,
    required: true,
  })
  public projectId!: Ref<ProjectClass>;

  // Order of the status column (used to arrange location of status columns)
  @prop({ required: true })
  public order!: number;

  @prop({ type: Boolean, default: false })
  public isProtected!: boolean;
}

export const Status =
  (mongoose.models.StatusClass as
    | ReturnModelType<typeof StatusClass>
    | undefined) ?? getModelForClass(StatusClass);
