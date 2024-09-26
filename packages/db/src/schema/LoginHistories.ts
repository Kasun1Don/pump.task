import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { collection: "loginHistories" } })
export class LoginHistoryClass extends TimeStamps {
  @prop({ type: () => String, auto: true })
  public _id?: Types.ObjectId;

  @prop({ default: "unknown" })
  public location?: string;

  @prop({ default: "unknown" })
  public browser?: string;

  @prop({ default: "unknown" })
  public operatingSystem?: string;
}

// Create the User model
export const LoginHistory =
  (mongoose.models.LoginHistoryClass as
    | ReturnModelType<typeof LoginHistoryClass>
    | undefined) ?? getModelForClass(LoginHistoryClass);
