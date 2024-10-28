import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
import { mongoose } from "@typegoose/typegoose";
import { StatusClass } from "./Status";

@modelOptions({
    schemaOptions: {
    collection: "templates",
    timestamps: true,
  },
})
export class TemplateClass {
  @prop({ required: true })
  public name!: string;

  @prop({ type: String })
  public description?: string;

  @prop({ type: ()=> [{
    name: String,
    order: Number,
    isProtected: Boolean,
  }],
    required: true,
  })
  // reuse the status schema but only pick the fields we need
  public statusColumns!: Pick<StatusClass, "name" | "order" | "isProtected">[];
}

export const Template =
  (mongoose.models.TemplateClass as
    | ReturnModelType<typeof TemplateClass>
    | undefined) ?? getModelForClass(TemplateClass);
