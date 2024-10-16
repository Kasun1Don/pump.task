import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ schemaOptions: { collection: "loginHistories" } })
export class LoginHistoryClass extends TimeStamps {
  @prop({ type: String, default: "unknown" })
  public location?: string;

  @prop({ type: String, default: "unknown" })
  public browser?: string;

  @prop({ type: String, default: "unknown" })
  public operatingSystem?: string;
}

// Create the User model
export const LoginHistory =
  (mongoose.models.LoginHistoryClass as
    | ReturnModelType<typeof LoginHistoryClass>
    | undefined) ?? getModelForClass(LoginHistoryClass);
