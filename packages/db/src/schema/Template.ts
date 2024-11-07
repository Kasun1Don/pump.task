import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { StatusClass } from "./Status";

@modelOptions({
  schemaOptions: {
    collection: "templates",
    timestamps: true,
  },
})
export class TemplateClass {
  @prop({ required: true, type: String })
  public name!: string;

  @prop({ type: String })
  public description?: string;

  @prop({ type: () => [StatusClass], required: true })
  public statusColumns!: {
    name: string;
    order: number;
    isProtected: boolean;
  }[];
}

export const Template =
  (mongoose.models.TemplateClass as
    | ReturnModelType<typeof TemplateClass>
    | undefined) ?? getModelForClass(TemplateClass);
