import { prop } from "@typegoose/typegoose";

class TagClass {
  // Predefined/default tags (e.g., "Frontend", "Backend")
  @prop({
    type: () => [String],
    required: false,
    default: [
      "Frontend",
      "Backend",
      "Design",
      "Smart Contracts",
      "Integration",
    ],
  })
  public defaultTags!: string[];

  // User-generated custom tags
  @prop({ type: () => [String], required: false, default: [] })
  public userGeneratedTags?: string[];
}

export { TagClass };
