import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "projects",
    timestamps: true,
  },
})
export class ProjectClass {
  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String })
  public image?: string;

  @prop({ type: String })
  public description?: string;

  @prop({ type: Boolean, required: true, default: false })
  public isPrivate!: boolean;

  @prop({ type: String, required: false })
  public templateId?: string;
}

export const Project =
  (mongoose.models.ProjectClass as
    | ReturnModelType<typeof ProjectClass>
    | undefined) ?? getModelForClass(ProjectClass);
