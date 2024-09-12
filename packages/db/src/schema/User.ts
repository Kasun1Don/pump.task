import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";

import { ProjectClass } from "./Projects";

/**
 * This collection is used by NextAuth to store user information.
 * This must contain the user's name, email, image, and email verification status.
 */
@modelOptions({ schemaOptions: { collection: "users" } })
export class UserClass {
  @prop()
  public walletId?: string;

  @prop()
  public name?: string;

  @prop()
  public email?: string;

  @prop()
  public image?: string;

  @prop()
  public emailVerified?: boolean;

  @prop({ ref: () => ProjectClass, type: () => [ProjectClass] })
  public projects?: Ref<ProjectClass>[];
}

// Create the User model
export const User =
  (mongoose.models.UserClass as
    | ReturnModelType<typeof UserClass>
    | undefined) ?? getModelForClass(UserClass);
