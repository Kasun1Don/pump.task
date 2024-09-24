import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class UserSettingsClass {
  @prop({ type: () => String, auto: true })
  public _id?: Types.ObjectId;

  @prop({ default: "English" })
  public language?: string;

  @prop({ default: "dark" })
  public theme?: string;

  @prop({ default: false })
  public twoFactorAuth?: boolean;

  @prop()
  public notificationEmail?: string;

  @prop({ default: true })
  public dueDate?: boolean;

  @prop({ default: true })
  public comments?: boolean;

  @prop({ default: true })
  public assignedToCard?: boolean;

  @prop({ default: true })
  public removedFromCard?: boolean;

  @prop({ default: true })
  public changeCardStatus?: boolean;

  @prop({ default: true })
  public newBadge?: boolean;
}
