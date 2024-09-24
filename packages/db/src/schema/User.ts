import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";

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

  // reference projects using ObjectId and a string ref to collection name
  // @prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Project" })
  // public projects?: mongoose.Types.ObjectId[];
}

// Create the User model
export const User = getModelForClass(UserClass);
