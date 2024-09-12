import type { Ref } from "@typegoose/typegoose";
import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import { UserClass } from "./User";

export class MemberSchema {
  @prop({ ref: () => UserClass })
  public user!: Ref<UserClass>;

  @prop({ required: true, enum: ["observer", "admin", "owner"] })
  public role!: "observer" | "admin" | "owner";
}

@modelOptions({ schemaOptions: { collection: "members" } }) // specify collection name for mongoose
export class MemberClass extends MemberSchema {}

export const Member =
  (mongoose.models.MemberClass as
    | ReturnModelType<typeof MemberClass>
    | undefined) ?? getModelForClass(MemberClass);
