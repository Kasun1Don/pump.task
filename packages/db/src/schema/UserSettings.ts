import { prop } from "@typegoose/typegoose";

export class UserSettingsClass {
  @prop({ type: String, default: "English" })
  public language?: string;

  @prop({ type: Boolean, default: false })
  public twoFactorAuth?: boolean;

  @prop({ type: String })
  public notificationEmail?: string;

  @prop({ type: Boolean, default: true })
  public dueDate?: boolean;

  @prop({ type: Boolean, default: true })
  public comments?: boolean;

  @prop({ type: Boolean, default: true })
  public assignedToCard?: boolean;

  @prop({ type: Boolean, default: true })
  public removedFromCard?: boolean;

  @prop({ type: Boolean, default: true })
  public changeCardStatus?: boolean;

  @prop({ type: Boolean, default: true })
  public newBadge?: boolean;
}
