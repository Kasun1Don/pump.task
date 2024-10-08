import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";

import { LoginHistoryClass } from "./LoginHistories";
import { ProjectClass } from "./Projects";
import { UserSettingsClass } from "./UserSettings";

@modelOptions({ schemaOptions: { collection: "users" } })
export class UserClass {
  @prop({ type: String, required: true, unique: true })
  public walletId?: string;

  @prop({ type: String })
  public name?: string;

  @prop({ type: String, unique: true })
  public email?: string;

  @prop({ type: String, default: "/profileImage1.png" })
  public image?: string;

  @prop({ type: Boolean, default: false })
  public emailVerified?: boolean;

  @prop({
    ref: () => ProjectClass,
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  })
  public projects?: Ref<ProjectClass>[];

  @prop({ type: () => UserSettingsClass })
  public userSettings?: UserSettingsClass;

  @prop({
    ref: () => LoginHistoryClass,
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  })
  public loginHistories?: Ref<LoginHistoryClass>[];
}

// Create the User model
export const User =
  (mongoose.models.UserClass as
    | ReturnModelType<typeof UserClass>
    | undefined) ?? getModelForClass(UserClass);
