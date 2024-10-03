import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { MemberSchema } from "./Member";

// import { StatusSchema } from "./Status";

@modelOptions({
  schemaOptions: {
    collection: "projects",
    timestamps: true,
  },
})
export class ProjectClass {
  @prop({ required: true })
  public name!: string;

  @prop()
  public image?: string;

  @prop({ required: true })
  public isPrivate!: boolean;

  @prop({ type: () => [MemberSchema], default: [] })
  public members!: MemberSchema[];

  // We dont want to have status as a subdocument, we only want to reference the Id's
  // @prop({ type: () => [StatusClass], required: true, default: [] })
  // public status!: StatusClass[];

  // an array containing the status ID's that belong to the current project
  // @prop({
  //   type: () => [mongoose.Schema.Types.ObjectId],
  //   ref: () => StatusClass,
  //   required: true,
  //   default: [],
  // })
  // public status!: Ref<StatusClass>[];

  @prop({ required: false })
  public templateId?: string; // Change from ObjectId to string
}

export const Project =
  (mongoose.models.ProjectClass as
    | ReturnModelType<typeof ProjectClass>
    | undefined) ?? getModelForClass(ProjectClass);
